<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MediaController extends Controller
{
    public function serve(string $path): BinaryFileResponse|Response
    {
        // Prevent directory traversal
        $path     = ltrim(str_replace('..', '', $path), '/');
        $fullPath = storage_path('app/public/' . $path);

        if (! file_exists($fullPath) || ! is_file($fullPath)) {
            abort(404);
        }

        return response()->file($fullPath, [
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
