<?php

namespace Zerp\LandingPage\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Zerp\LandingPage\Models\NewsletterSubscriber;

class DestroyNewsletterSubscriber
{
    use Dispatchable;

    public function __construct(
        public NewsletterSubscriber $subscriber,
    ) {}
}