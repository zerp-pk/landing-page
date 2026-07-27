<?php

namespace Zerp\LandingPage\Tests;

use Orchestra\Testbench\TestCase as Orchestra;
use Zerp\LandingPage\Providers\LandingPageServiceProvider;

abstract class TestCase extends Orchestra
{
    protected function getPackageProviders($app): array
    {
        return [LandingPageServiceProvider::class];
    }
}
