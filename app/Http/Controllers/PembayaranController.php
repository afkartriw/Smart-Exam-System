<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use App\Models\Lembaga;
use App\Models\Order;
use App\Models\Poin;
use Illuminate\Support\Facades\Auth;

class PembayaranController extends Controller
{
    public function payment(Request $request, $id_poin) {
        Config::$serverKey = 'SB-Mid-server-rO6zImdkGR58CgRthKcWsLWh';
        Config::$isProduction = false;
        Config::$isSanitized = true;
        Config::$is3ds = true;
    
        $user = Auth::user();
        if (!$user || $user->role !== 'lembaga') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $lembaga = Lembaga::where('user_id', $user->id)->first();
        if (!$lembaga) {
            return response()->json(['message' => 'Lembaga tidak ditemukan atau belum terdaftar'], 404);
        }
    
        // Ambil data poin berdasarkan id_poin
        $poin = Poin::find($id_poin);
        if (!$poin) {
            return response()->json(['message' => 'Poin tidak ditemukan'], 404);
        }
    
        $params = [
            'transaction_details' => [
                'order_id' => 'ORDER-' . rand(),
                'gross_amount' => $poin->harga,
            ],
            'item_details' => [
                [
                    'id' => $poin->id,
                    'price' => $poin->harga,
                    'quantity' => 1,
                    'name' => $poin->nama,
                ]
            ],
            'customer_details' => [
                'first_name' => $lembaga->nama_lengkap,
                'last_name' => '',
                'email' => $lembaga->email,
                'phone' => $lembaga->whatsapp,
            ],
        ];
    
        try {
            $snapToken = Snap::getSnapToken($params);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    
        return Inertia::render('Role/Lembaga/Pembayaran', [
            'snap_token' => $snapToken,
            'csrf_token' => csrf_token(),
            'nama_lengkap' => $lembaga->nama_lengkap,
            'nama_lembaga' => $lembaga->nama_lembaga,
            'nama' => $poin->nama,
            'jumlah_poin' => $poin->jumlah_poin,
            'harga' => $poin->harga,
            'poin_id' => $poin->id, // Kirim poin_id ke frontend
        ]);
    }
    
    public function payment_post(Request $request) {
        $user = Auth::user();
        if (!$user || $user->role !== 'lembaga') {
            return redirect()->back()->with('alert-failed', 'Unauthorized');
        }
    
        $lembaga = Lembaga::where('user_id', $user->id)->first();
        if (!$lembaga) {
            return redirect()->back()->with('alert-failed', 'Lembaga tidak ditemukan atau belum terdaftar');
        }
    
        $json = json_decode($request->json, true);
        if (!$json) {
            return redirect()->back()->with('alert-failed', 'Invalid payment data');
        }
    
        // Pastikan poin_id ada dan valid
        $poin_id = $request->poin_id;
        $poin = Poin::find($poin_id);
        if (!$poin) {
            return redirect()->back()->with('alert-failed', 'Poin tidak ditemukan');
        }
    
        $order = new Order();
        $order->fill([
            'status' => $json['transaction_status'] ?? 'unknown',
            'uname' => $lembaga->nama_lengkap,
            'email' => $lembaga->email,
            'number' => $lembaga->whatsapp,
            'transaction_id' => $json['transaction_id'] ?? null,
            'order_id' => $json['order_id'] ?? null,
            'gross_amount' => $json['gross_amount'] ?? 0,
            'payment_type' => $json['payment_type'] ?? 'unknown',
            'payment_code' => $json['payment_code'] ?? null,
            'pdf_url' => $json['pdf_url'] ?? null,
            'lembaga_id' => $lembaga->id,
            'poin_id' => $poin_id, // Simpan poin_id dari request
        ]);
    
        if ($order->save()) {
            if ($order->status === 'settlement') {
                $lembaga->poin += $poin->jumlah_poin;
                $lembaga->save();
            }
            return redirect('/lembaga/riwayat')->with('alert-success', 'Order berhasil dibuat');
        } else {
            return redirect('/lembaga/riwayat')->with('alert-failed', 'Order gagal dibuat');
        }
        
    }
    
    
}