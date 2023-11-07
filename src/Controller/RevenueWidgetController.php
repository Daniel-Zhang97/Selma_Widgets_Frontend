<?php

namespace App\Controller;

use http\Message\Body;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class RevenueWidgetController extends AbstractController
{
    #[Route('/home', name: 'revenue')]
    public function widgetMain(): Response
    {

        $filterOptions = ['options' => 'object'];

        return $this->render('index.html.twig', [
            'filterOptions' => $filterOptions,
        ]);
    }


    #[Route('/revenue_report', name: 'revenue_report')]
    public function generateReport(Request $request): JsonResponse
    {
        $filterOptionsJSON = $request->getContent();

        // Construct the URL with query parameters
        $url = $this->generateUrl('revenueReport', ['filterOptions' => $filterOptionsJSON]);

        // Return a redirect response to the generated URL
        return new JsonResponse(['url' => $url]);
    }


    #[Route('/revenue_report_view', name: 'revenueReport')]
    public function revenueReport(Request $request): Response
    {
        // Retrieve the filter options from the request parameters
        $filterOptionsJSON = $request->query->get('filterOptions');

        // Decode the JSON string to get the filterOptions as an array
        $filterOptions = json_decode($filterOptionsJSON, true);

        return $this->render('revenueReport.html.twig', [
            'filterOptions' => $filterOptions,
        ]);
    }
}