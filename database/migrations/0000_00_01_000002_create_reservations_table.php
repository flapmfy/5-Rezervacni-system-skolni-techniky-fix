<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->index();
            $table->foreignId('equipment_id')
                ->constrained()
                ->onDelete('restrict')
                ->index();
            $table->enum('status', [
                'neschváleno',
                'schváleno',
                'probíhá',
                'archivováno',
            ])->default('neschváleno');
            $table->text('comment')->nullable();
            $table->text('user_comment')->nullable();
            $table->string('equipment_condition_start', 255)->nullable();
            $table->string('equipment_condition_end', 255)->nullable();
            $table->date('start_date')->index();
            $table->date('end_date')->index();
            $table->date('pickup_date')->nullable();
            $table->date('return_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
