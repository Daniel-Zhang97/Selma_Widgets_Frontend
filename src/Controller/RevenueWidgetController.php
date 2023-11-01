<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RevenueWidgetController extends AbstractController
{
    #[Route('/', name: 'revenue')]
    public function widgetMain(): Response
    {

        return $this->render('index.html.twig');
    }

}