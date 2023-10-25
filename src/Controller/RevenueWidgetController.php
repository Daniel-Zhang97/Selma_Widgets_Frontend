<?php

namespace App\Controller;



use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RevenueWidgetController
{
    #[Route('/')]
    public function widgetMain () {
        return new Response('test');
    }

}