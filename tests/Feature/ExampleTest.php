<?php

use Inertia\Testing\AssertableInertia as Assert;

test('renders the document management page', function () {
    $response = $this->get(route('home'));

    $response->assertOk()->assertInertia(
        fn (Assert $page) => $page->component('documents/index'),
    );
});
