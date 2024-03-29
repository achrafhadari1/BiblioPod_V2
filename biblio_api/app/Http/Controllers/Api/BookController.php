<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; // Import the Str class
class BookController extends Controller
{
    public function store(Request $request)
{
    // Validate incoming request
    $validatedData = $request->validate([
        'isbn' => 'required|string|unique:books,isbn,NULL,id,user_id,' . Auth::id(),
        'title' => 'required|string',
        'author' => 'required|string',
        'publisher' => 'nullable|string',
        'language' => 'nullable|string',
        'thumbnail' => 'nullable|string',
        'description' => 'nullable|string',
        'file_directory' => 'string',
        'genre' => 'nullable | string'
        
    ]);

    $user_id = Auth::id(); 
    $directoryPath = "public/users/user_{$user_id}/books";
    
    // Retrieve the uploaded file and its original name
    $uploadedFile = $request->file('file');
    $originalFileName = $uploadedFile->getClientOriginalName();
    
    // Generate a unique filename
    $filename = uniqid() . '_' . $originalFileName;
    
    // Store the uploaded file
    $uploadedFile->storeAs($directoryPath, $filename);
    
    // Create a new book instance associated with the user
    $book = Book::create([
        'isbn' => $validatedData['isbn'], // Use the provided ISBN
        'user_id' => $user_id,
        'title' => $validatedData['title'],
        'author' => $validatedData['author'],
        'publisher' => $validatedData['publisher'],
        'language' => $validatedData['language'],
        'thumbnail' => $validatedData['thumbnail'],
        'description' => $validatedData['description'],
        'file_directory' => $filename, 
        'genre' => $validatedData['genre'],
    ]);


    return response()->json(['message' => 'Book stored successfully', 'book' => $book], 201);
}

    public function index()
    {
        // Get the currently authenticated user's ID
        $user_id = Auth::id();

        // Fetch all books associated with the user
        $books = Book::where('user_id', $user_id)->get();

        return response()->json(['books' => $books], 200);
    }
    public function destroy($isbn)
    {
        // Get the currently authenticated user's ID
        $user_id = Auth::id();
        try {
            // Find the book by its composite keys
            $book = Book::where('isbn', $isbn)
                        ->where('user_id', $user_id)
                        ->first();
    
            // Check if the book exists
            if (!$book) {
                return response()->json(['error' => 'Book not found'], 404);
            }
    
            // Delete the associated ePub file
            Storage::delete("public/users/user_{$user_id}/books/{$book->file_directory}");
    
            // Delete the associated thumbnail image if it exists
            if ($book->thumbnail) {
                Storage::delete($book->thumbnail);
            }
    
            // Delete the book
            $book->delete();
    
            return response()->json(['message' => 'Book deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete book'], 500);
        }
    }
    

    

    

    
    public function show($isbn)
    {
        try {
            // Fetch the book by its identifier
            $user_id = Auth::id();
            $book = Book::where('user_id', $user_id)
                        ->where('isbn', $isbn)
                        ->first();
    
            if (!$book) {
                return response()->json(['error' => 'Book not found'], 404);
            }
    
            // You may need to adjust the response format based on your requirements
            return response()->json(['book' => $book], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch book'], 500);
        }
    }
public function getFile($userId, $filename) {
    // Assuming the files are stored in the 'public' disk under the specified directory
    $filePath = "users/user_$userId/books/$filename";


    // Check if the file exists
    if (Storage::disk('public')->exists($filePath)) {
       
        return Storage::disk('public')->download($filePath);
    } else {
        // File not found, return a 404 response
        return response()->json(['error' => 'File not found','path'=> $filePath], 404);
    }
}

public function update(Request $request, $isbn)
{
    // Validate incoming request
    $validatedData = $request->validate([
        'title' => 'required|string',
        'author' => 'required|string',
        'genre' => 'nullable|string',
        'language' => 'nullable|string',
        'thumbnail' => 'nullable|string',
        'description' => 'nullable|string',
    ]);

    // Check if any of the required fields are empty
    $requiredFields = ['title', 'author'];
    foreach ($requiredFields as $field) {
        if (empty($validatedData[$field])) {
            return response()->json(['error' => ucfirst($field) . ' is required'], 422);
        }
    }

    // Find the book by its ISBN and user_id
    $user_id = Auth::id();
    $book = Book::where('user_id', $user_id)
                ->where('isbn', $isbn)
                ->firstOrFail();

    // Store the thumbnail image if provided
    if ($request->has('thumbnail')) {
        // Decode the base64 string
        $base64Image = $request->input('thumbnail');
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));
        
        // Generate a unique filename
        $thumbnailFileName = Str::random(10) . '.png';
        
        // Store the image file
        $thumbnailFilePath = "public/users/user_{$user_id}/books/images/{$thumbnailFileName}";
        Storage::put($thumbnailFilePath, $imageData);

        // Update the validated data with the file path
        $validatedData['thumbnail'] = $thumbnailFilePath;
    }

    // Update the book details
    $book->update($validatedData);

    return response()->json(['message' => 'Book updated successfully', 'book' => $book], 200);
}



public function rate(Request $request, $isbn)
{
    $validatedData = $request->validate([
        'rating' => 'required|numeric|min:1|max:5',
    ]);

    $user_id = Auth::id();
    
    \Log::info('ISBN: ' . $isbn);
    \Log::info('User ID: ' . $user_id);

    \DB::listen(function ($query) {
        \Log::info($query->sql);
        \Log::info($query->bindings);
    });

    $book = Book::where('user_id', $user_id)
                ->where('isbn', $isbn)
                ->first();

    if (!$book) {
        return response()->json(['error' => 'Book not found or unauthorized', 'book' => $book], 404);
    }

    // Update the rating
    $book->update(['rating' => $validatedData['rating']]);

    return response()->json(['message' => 'Book rating updated successfully', 'book' => $book], 200);
}

public function getBooksAndAnnotations()
{
    
    $user_id = Auth::id();

    // Fetch books with annotations for the authenticated user
    $books = Book::where('user_id', $user_id)
        ->with('annotations')
        ->withCount('annotations')
        ->get();
        
    return response()->json(['books' => $books], 200);
}


}
