<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Book;
use App\Models\User;

class Annotation extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'book_isbn', 'text', 'color', 'cfi_range'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function book()
    {
        return $this->belongsTo(Book::class, 'book_isbn', 'isbn');
    }
}

