<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public $email;
    public $password;

    public function __construct($email, $password)
    {
        $this->email = $email;
        $this->password = $password;
    }

    public function build()
    {
        return $this->subject('SMART-EXAM_SYSTEM')
                    ->from('iqfarryd@gmail.com', 'Smart-Exam-System')
                    ->view('emails.send_credentials') // Pastikan ini benar
                    ->with([
                        'email' => $this->email,
                        'password' => $this->password,
                    ])
                    ->setContentType('text/html'); // 👈 Ini penting untuk mengatur format HTML
    }
    
}
