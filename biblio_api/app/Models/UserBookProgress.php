<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBookProgress extends Model
{
    use HasFactory;

    protected $table = 'user_book_progress';

    protected $fillable = [
        'user_id',
        'isbn',
        'current_percentage',
        'current_cfi',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class, 'isbn', 'isbn');
    }
}
