<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mews\Captcha\Facades\Captcha;
use Illuminate\Http\JsonResponse;

class CaptchaController extends Controller
{
    /**
     * Mengembalikan gambar CAPTCHA dalam format JSON.
     */
    public function getCaptchaImage(): JsonResponse
    {
        return response()->json([
            'captcha' => Captcha::src('math')
        ]);
    }

    /**
     * Memverifikasi input CAPTCHA dari pengguna.
     */
    public function verifyCaptcha(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'captcha' => 'required|string'
        ]);

        if (!Captcha::check($validated['captcha'])) {
            return response()->json([
                'success' => false,
                'message' => 'CAPTCHA salah. Silakan coba lagi.'
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'CAPTCHA benar.'
        ]);
    }
}
