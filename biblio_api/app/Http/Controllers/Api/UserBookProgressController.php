<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\UserBookProgress;

use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class UserBookProgressController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'isbn' => 'required|exists:books,isbn',
            'current_percentage' => 'required|integer|min:0|max:100',
            'current_cfi' => 'nullable|string',
        ]);
        $user_id = auth()->id(); // Get the authenticated user's ID

        $progress = UserBookProgress::updateOrCreate(
            [
                'user_id' => $user_id,
                'isbn' => $request->isbn,
            ],
            [
                'current_percentage' => $request->current_percentage,
                'current_cfi' => $request->current_cfi,
            ]
        );

        return response()->json(['message' => 'Reading progress stored successfully', 'progress' => $progress]);
    }

    public function getCurrentProgress($isbn)
{
    try {
        $user_id = auth()->id(); 
        // Find the user's book progress based on user_id and isbn
        $progress = UserBookProgress::where('user_id', $user_id)
            ->where('isbn', $isbn)
            ->first();

        if (!$progress) {
            return response()->json(['message' => 'Book progress not found'], 404);
        }

        // Return the current_cfi
        return response()->json(['progress' => $progress]);
    } catch (\Exception $e) {
        // Handle any errors
        return response()->json(['message' => 'Failed to fetch book progress', 'error' => $e->getMessage()], 500);
    }
}

public function destroy($isbn)
    {
        $user_id = Auth::id();
try {
    $userProgress=UserBookProgress::where("isbn",$isbn)->where("user_id",$user_id)->first();
    if (!$userProgress) {
        return response()->json(['error' => 'Book not found'], 404);
    }
    $userProgress->delete();
    
    return response()->json(['message' => 'Book progress deleted successfully'], 200);
} catch (\Exception $e) {
    return response()->json(['error' => 'Failed to delete book'], 500);
}            

    }
}

