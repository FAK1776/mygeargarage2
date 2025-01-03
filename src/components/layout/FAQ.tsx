import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Axe Vault?",
    answer: "Axe Vault is a comprehensive platform for musicians to track, manage, and document their gear collection. You can catalog instruments, track service history, view a timeline of events, and get insights about your collection."
  },
  {
    question: "How do I schedule maintenance for my gear?",
    answer: "Navigate to the Maintenance Dashboard and click 'Schedule Maintenance'. Select your gear item, enter the task description, set the frequency (e.g., every 3 months), and choose a due date. The system will automatically track and remind you of upcoming maintenance tasks."
  },
  {
    question: "How do I manage maintenance tasks?",
    answer: "On the Maintenance Dashboard, you can view all scheduled tasks. Click the green 'Complete' button to mark a task as done - it will automatically schedule the next occurrence. Use the 'Reschedule' button to adjust due dates. Completed tasks remain visible for reference."
  },
  {
    question: "How do I add new gear to my collection?",
    answer: "Click 'Add Gear' in the navigation bar. Our smart specification parser will help you enter gear details, or you can manually input specifications. Add photos with real-time upload progress, and all changes are automatically saved."
  },
  {
    question: "How does the Timeline View work?",
    answer: "The Timeline View shows a chronological display of all gear-related events including purchases, sales, and service history. You can filter by event type, specific instruments, or use the full-text search to find particular events."
  },
  {
    question: "What kind of specifications can I track?",
    answer: "The application supports comprehensive specifications including overview (manufacturer, model), body details (design, bracing, dimensions), neck & headstock specs, electronics configuration, and hardware components. Fields are dynamically rendered based on your gear type."
  },
  {
    question: "How do I manage service history?",
    answer: "Each gear item has a service history section where you can log maintenance, repairs, and modifications. You can track service providers, costs, and categorize service types. All service records appear in your timeline view. Soon, you'll be able to automatically add completed maintenance tasks to your gear's history."
  },
  {
    question: "What insights does the Profile section provide?",
    answer: "The Profile section shows collection statistics, gear distribution, and insights about your collection. You can also manage your preferences, customize your experience, and adjust notification settings."
  },
  {
    question: "Is my gear data private and secure?",
    answer: "Yes, your data is private and secured using Firebase Authentication and Security Rules. Images are stored securely in Firebase Storage, and all data transfers are encrypted."
  },
  {
    question: "How can I organize and filter my collection?",
    answer: "The Home page offers comprehensive filtering options, quick actions for common tasks, and a responsive grid layout. You can use instant search, sort by various criteria, and view collection statistics at a glance."
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