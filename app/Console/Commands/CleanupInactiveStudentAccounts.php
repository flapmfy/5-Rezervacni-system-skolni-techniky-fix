<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CleanupInactiveStudentAccounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-inactive-students {--years=4 : Years of inactivity before deletion} {--dry-run : Run without actually deleting accounts}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete student accounts that have been inactive for a specified period';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $yearsOfInactivity = $this->option('years');
        $dryRun = $this->option('dry-run');

        $this->info("Looking for student accounts inactive for {$yearsOfInactivity}+ years...");

        // Find students with no reservations in last X years, or no reservations at all
        $inactiveDate = now()->subYears($yearsOfInactivity);

        // Start by getting student accounts
        $query = User::where('role', 'student')
            ->where(function ($query) use ($inactiveDate) {
                // Either has no reservations, or last reservation is older than cutoff date
                $query->whereDoesntHave('reservations')
                    ->orWhereHas('reservations', function ($q) use ($inactiveDate) {
                        $q->groupBy('user_id')
                          ->havingRaw('MAX(created_at) < ?', [$inactiveDate]);
                    });
            });

        $count = $query->count();
        
        if ($count === 0) {
            $this->info('No inactive student accounts found.');
            return;
        }

        $this->info("Found {$count} inactive student accounts.");

        if ($dryRun) {
            $this->warn('Dry run mode - no accounts will be deleted.');
            $this->table(
                ['ID', 'Name', 'Email', 'Last Activity'],
                $query->get()->map(function ($user) {
                    $lastReservation = $user->reservations()->latest()->first();
                    return [
                        'id' => $user->id,
                        'name' => $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email,
                        'last_activity' => $lastReservation ? $lastReservation->created_at->format('Y-m-d') : 'Never'
                    ];
                })
            );
            return;
        }

        if (!$this->confirm('Are you sure you want to delete these accounts? This action cannot be undone.')) {
            $this->info('Operation cancelled.');
            return;
        }

        // Perform the deletion within a transaction
        DB::beginTransaction();
        try {
            $deletedIds = [];
            foreach ($query->get() as $user) {
                $deletedIds[] = $user->id;
                $user->delete(); // This will cascade delete reservations if FK constraints are set up
            }
            
            DB::commit();
            
            Log::info('Deleted inactive student accounts', [
                'count' => count($deletedIds),
                'user_ids' => $deletedIds,
                'inactivity_threshold' => $yearsOfInactivity . ' years'
            ]);
            
            $this->info('Successfully deleted ' . count($deletedIds) . ' inactive student accounts.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete inactive student accounts', [
                'error' => $e->getMessage()
            ]);
            $this->error('Error deleting accounts: ' . $e->getMessage());
        }
    }
}
