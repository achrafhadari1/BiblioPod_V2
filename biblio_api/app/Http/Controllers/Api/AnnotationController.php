<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Annotation;

class AnnotationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'book_isbn' => 'required|string',
            'text' => 'required|string',
            'color' => 'required|string',
            'cfi_range' => 'required|string',
        ]);

        $annotation = Annotation::create([
            'user_id' => auth()->id(),
            'book_isbn' => $request->book_isbn,
            'text' => $request->text,
            'color' => $request->color,
            'cfi_range' => $request->cfi_range,
        ]);

        return response()->json($annotation, 201);
    }

    public function index(Request $request)
    {
        $annotations = Annotation::where('user_id', auth()->id())
            ->where('book_isbn', $request->book_isbn)
            ->get();

        return response()->json($annotations);
    }

    public function destroy(Request $request, $id)
    {
        $annotation = Annotation::find($id);

        if (!$annotation) {
            return response()->json(['message' => 'Annotation not found'], 404);
        }

        if ($annotation->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $annotation->delete();

        return response()->json(['message' => 'Annotation deleted'], 200);
    }
}
