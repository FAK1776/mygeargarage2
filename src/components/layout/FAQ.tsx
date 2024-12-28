import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is My Gear Garage?",
    answer: "My Gear Garage is a digital platform for musicians to track, manage, and tell stories about their gear collection. You can catalog your owned gear, maintain a wishlist, and keep track of sold items."
  },
  {
    question: "How do I add new gear to my collection?",
    answer: "Click the 'Add Gear' button in the navigation bar. Fill out the details about your gear including make, model, and status (Own, Want, or Sold). You can also add photos and notes about your gear."
  },
  {
    question: "What's the difference between Own, Want, and Sold status?",
    answer: "'Own' is for gear you currently possess, 'Want' creates a wishlist of gear you're interested in acquiring, and 'Sold' helps you track gear you've previously owned but have since sold."
  },
  {
    question: "What is the Gear Story feature?",
    answer: "The Gear Story feature uses AI to generate engaging narratives about your gear collection. It analyzes your collection and creates unique stories in different styles, highlighting interesting patterns and insights about your gear choices."
  },
  {
    question: "Can I edit or delete gear from my collection?",
    answer: "Yes, you can edit or delete any gear in your collection. Each gear card has options to edit details or remove the item completely. You can also change the status of gear items as your collection evolves."
  },
  {
    question: "Is my gear data private?",
    answer: "Yes, your gear collection data is private and only visible to you when logged into your account. We use secure authentication and database systems to protect your information."
  },
  {
    question: "How do I organize my gear collection?",
    answer: "You can filter your gear by status (Own/Want/Sold) and use the search function to find specific items. The My Profile page also provides insights and statistics about your collection."
  }
];

export const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-gray-900 mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-2">{faq.question}</h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 