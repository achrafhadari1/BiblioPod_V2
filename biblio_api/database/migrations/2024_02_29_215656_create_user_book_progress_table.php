<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserBookProgressTable extends Migration
{
    public function up()
    {
        Schema::create('user_book_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('isbn')->index();
            $table->integer('current_percentage')->default(0);
            $table->string('current_cfi')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'isbn']); // Make combination unique
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_book_progress');
    }
}
