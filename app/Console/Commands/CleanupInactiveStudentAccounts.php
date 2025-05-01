<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CleanupOldStudentAccounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-old-students {--years=4 : Years since account creation before deletion} {--dry-run : Run without actually deleting accounts}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete student accounts that were created more than specified years ago';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $yearsThreshold = $this->option('years');
        $dryRun = $this->option('dry-run');

        $this->info("Looking for student accounts created {$yearsThreshold}+ years ago...");

        // Find students created X years ago or more
        $cutoffDate = now()->subYears($yearsThreshold);
        
        $query = User::where('role', 'student')
                    ->where('created_at', '<', $cutoffDate);

        $count = $query->count();
        
        if ($count === 0) {
            $this->info('No old student accounts found.');
            return;
        }

        $this->info("Found {$count} old student accounts.");

        if ($dryRun) {
            $this->warn('Dry run mode - no accounts will be deleted.');
            $this->table(
                ['ID', 'Name', 'Email', 'Created At'],
                $query->get()->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email,
                        'created_at' => $user->created_at->format('Y-m-d')
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
            $deletedCount = $query->delete(); // This will cascade delete reservations if FK constraints are set up
            
            DB::commit();
            
            Log::info('Deleted old student accounts', [
                'count' => $deletedCount,
                'age_threshold' => $yearsThreshold . ' years',
                'cutoff_date' => $cutoffDate->format('Y-m-d')
            ]);
            
            $this->info("Successfully deleted {$deletedCount} old student accounts.");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete old student accounts', [
                'error' => $e->getMessage()
            ]);
            $this->error('Error deleting accounts: ' . $e->getMessage());
        }
    }
}
