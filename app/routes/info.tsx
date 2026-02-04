import { ChevronDown } from 'lucide-react';

export const meta = () => {
  return [
    {
      title: 'About Share TodoList',
      description:
        'Help you share your to-do list with your friends and collaborators',
    },
  ];
};

const PrivacyPolicyItems = [
  {
    title: '1. Data Collection & Usage',
    content:
      'We collect only the data necessary for the functionality of Shareable Todo, including but not limited to task details, descriptions, and account information provided via third-party authentication providers. This data is used solely to maintain, provide, and improve our services. We do not use your personal content for ad targeting.',
  },
  {
    title: '2. Data Security & Storage Risks',
    content:
      'No method of transmission over the Internet or electronic storage is 100% secure. You acknowledge that you provide personal information at your own risk. We strongly advise against storing highly sensitive personal information (such as government IDs, credit card numbers, passwords, or health records) within the application. We assume no liability for the exposure of such sensitive information.',
  },
  {
    title: '3. Data Sharing & Third-Party Disclosure',
    content:
      'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties for marketing purposes. However, we may share data with trusted third-party service providers (e.g., cloud hosting, authentication services like Google/Discord, AI providers) solely for the purpose of operating our service. Your interaction with these third-party services is also governed by their respective privacy policies.',
  },
  {
    title: '4. User-Unitiated Sharing & Public Visibility',
    content:
      'A core feature of this platform is the ability to share Todo lists via unique links. By generating a share link, you acknowledge that the specific content within that list becomes accessible to anyone who possesses the link. We cannot control who accesses the link once you have shared it. You are solely responsible for the consequences of sharing your data, and we assume no responsibility for data leaks resulting from your voluntary sharing actions.',
  },
  {
    title: '5. Cookies & Tracking Technologies',
    content:
      'We use cookies and similar tracking technologies strictly for authentication and session management purposes. We do not use cookies for third-party advertising tracking.',
  },
];

const TermsOfServiceItems = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using Shareable Todo, you agree to be bound by these Terms. If you disagree with any part of the terms, you must discontinue use of the service immediately. Your continued use constitutes full acceptance of these terms.',
  },
  {
    title: '2. Modifications to Terms',
    content:
      'We reserve the right to modify, replace, or update these terms at any time without prior specific notice. The latest version will always be posted on this page. It is your responsibility to review these terms periodically. Continued use of the service following any changes constitutes acceptance of the new terms.',
  },
  {
    title: '3. User Conduct & Content Responsibility',
    content:
      'You are solely responsible for all content (data, text, information) that you upload, post, or share. You agree not to use the service to store or transmit any unlawful, threatening, abusive, libelous, defamatory, obscene, or otherwise objectionable material. We reserve the right (but have no obligation) to remove content that violates these terms or is deemed inappropriate.',
  },
  {
    title: '4. Disclaimer of Warranties',
    content:
      'The service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. We do not warrant that the service will be uninterrupted, secure, or error-free.',
  },
  {
    title: '5. Limitation of Liability',
    content:
      'In no event shall Shareable Todo, its developers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use, or alteration of your transmissions or content.',
  },
  {
    title: '6. Data Loss & Backup',
    content:
      'We are not responsible for any loss of data. You are solely responsible for maintaining independent backups of your own data. We shall not be liable for any deletion, corruption, or failure to store any user content due to technical failures, acts of God, or maintenance operations.',
  },
  {
    title: '7. Indemnification',
    content:
      "You agree to defend, indemnify, and hold harmless Shareable Todo and its developers from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Service; (ii) your violation of any term of these Terms; (iii) your violation of any third party right, including without limitation any copyright, property, or privacy right.",
  },
  {
    title: '8. Termination',
    content:
      'We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.',
  },
];

function PolicySection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: typeof PrivacyPolicyItems;
}) {
  return (
    <div className="bg-white/5 outline-1 outline-gray-400/40 p-6 rounded-xl flex flex-col gap-4 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-green-500 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <details
            key={index}
            className="group outline-1 outline-white/10 rounded-lg bg-white/5 open:bg-white/10 transition-all duration-200"
          >
            <summary className="flex cursor-pointer items-center justify-between p-4 font-semibold text-white marker:content-none hover:bg-white/5 rounded-lg select-none">
              <span>{item.title}</span>
              <ChevronDown className="w-5 h-5 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="p-4 pt-0 text-gray-300 text-sm leading-relaxed border-t border-white/5 animate-in slide-in-from-top-2">
              <p>{item.content}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function Info() {
  return (
    <div className="flex flex-col w-full h-full text-white items-center overflow-y-auto p-4 md:py-12">
      <div className="max-w-3xl w-full flex flex-col gap-6 pb-12">
        {/* Contact Section */}
        <div className="bg-white/5 outline-1 outline-gray-400/40 p-6 rounded-xl flex flex-col gap-4 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-green-500">Contact</h2>
          <div className="flex flex-wrap gap-4 justify-around">
            <a
              href="mailto:pika@mail.pikacnu.com"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>📧</span>
              <span>Mail</span>
            </a>
            <div className="px-4 py-2 bg-white/10 rounded-lg flex items-center gap-2 cursor-default">
              <img src="/icons/discord.svg" alt="Discord" className="w-4 h-4" />
              <span>Discord ID : Pikacnu</span>
            </div>
          </div>
        </div>

        <PolicySection
          title="Privacy Policy"
          icon="🛡️"
          items={PrivacyPolicyItems}
        />

        <PolicySection
          title="Terms of Service"
          icon="📜"
          items={TermsOfServiceItems}
        />
      </div>
    </div>
  );
}
