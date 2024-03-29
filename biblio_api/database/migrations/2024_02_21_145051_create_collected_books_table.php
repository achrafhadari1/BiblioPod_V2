<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollectedBooksTable extends Migration
{
    public function up()
    {
        Schema::create('collected_books', function (Blueprint $table) {
            $table->id();
            $table->string('isbn');
            $table->foreign('isbn')->references('isbn')->on('books')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('collection_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('collected_books');
    }
}

