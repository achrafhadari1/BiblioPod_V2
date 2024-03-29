<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CollectedBooksController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\UserBookProgressController;
use App\Http\Controllers\Api\AnnotationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/auth/register', [UserController::class, 'createUser']);
Route::post('/auth/login', [UserController::class, 'loginUser']);

Route::middleware('auth:sanctum')->group(function () {
    // User Routes
    Route::get('/user', [UserController::class, 'getUser']);

    // Book Routes
    Route::post('/books', [BookController::class, 'store']);
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{isbn}', [BookController::class, 'show']);
    Route::get('books/{userId}/files/{filename}', [BookController::class, 'getFile']);
    Route::put('/books/{isbn}', [BookController::class, 'update']);
    Route::put('/books/{isbn}/rate', [BookController::class, 'rate']);
    Route::delete('/books/{isbn}', [BookController::class, 'destroy']);

    // Collection Routes
    Route::post('/collections', [CollectionController::class, 'store']); // Create a new collection
    Route::get('/collections', [CollectionController::class, 'index']);
    Route::get('/collections/{id}', [CollectionController::class, 'getCollectionName']);
    Route::delete('/collections/{id}', [CollectionController::class, 'delete']); // Route for deleting a collection
    Route::put('/collections/{id}', [CollectionController::class, 'update']);

    // Collected Books Routes
    Route::post('/collected-books', [CollectedBooksController::class, 'store']);
    Route::get('/collected-books/{identifier}', [CollectedBooksController::class, 'getBookCollections']);
    Route::get('/collected-books/details/{collectionId}', [CollectedBooksController::class, 'getBookDetailsByCollectionId']);
    Route::delete('/collected-books/{collectionId}/{bookId}', [CollectedBooksController::class, 'deleteBook']);

    Route::post('/user-book-progress', [UserBookProgressController::class, 'store']);
    Route::get('/user-book-progress/{isbn}', [UserBookProgressController::class, 'getCurrentProgress']);
    Route::delete('/user-book-progress/{isbn}', [UserBookProgressController::class, 'destroy']);


    Route::post('/annotations', [AnnotationController::class, 'store']);
    Route::get('/annotations', [AnnotationController::class, 'index']);
    Route::delete('/annotations/{id}', [AnnotationController::class, 'destroy']);
    Route::get('/annotationswithBooks', [BookController::class, 'getBooksAndAnnotations']);

});
