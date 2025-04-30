<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->index();
            $table->foreignId('category_id')
                ->nullable()
                ->constrained()
                ->onDelete('restrict');
            $table->string('image_path', 255)->nullable();
            $table->string('slug')->unique()->index();
            $table->string('manufacturer', 100);
            $table->string('name', 150)->index();
            $table->text('description');
            $table->string('room', 50);
            $table->unsignedTinyInteger('quantity')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
