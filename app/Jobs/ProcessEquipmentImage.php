<?php

namespace App\Jobs;

use App\Models\Equipment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ProcessEquipmentImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $equipmentId;

    protected $originalFile;

    protected $filename;

    protected $tempPath;  // Add this property

    public function __construct($equipmentId, $originalFile, $filename, $tempPath)  // Add tempPath parameter
    {
        $this->equipmentId = $equipmentId;
        $this->originalFile = $originalFile;
        $this->filename = $filename;
        $this->tempPath = $tempPath;  // Store the relative temp path
    }

    public function handle()
    {
        try {
            $processedImage = Image::read($this->originalFile)
                ->scaleDown(width: 800)
                ->toWebp();

            $path = 'equipment/'.$this->filename;
            Storage::disk('public')->put($path, $processedImage);

            // Update the equipment record with the final image path
            $equipment = Equipment::find($this->equipmentId);
            if ($equipment) {
                $equipment->update(['image_path' => $path]);
            }
        } catch (\Exception $e) {
            // Log the error
            Log::error('Image processing failed: '.$e->getMessage());
        } finally {
            // Delete the temp file using the relative path
            Storage::delete($this->tempPath);
        }
    }
}
