<?php

namespace Zerp\LandingPage\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $senderName,
        public string $senderEmail,
        public string $messageSubject,
        public string $messageBody,
    ) {}

    public function build()
    {
        return $this->subject('Contact form: ' . $this->messageSubject)
            ->replyTo($this->senderEmail, $this->senderName)
            ->view('landing-page::emails.contact-message');
    }
}
