export async function GET() {
	return new Response(
		`Privacy Policy

        Effective Date: 07/10/2024
        
        1. Introduction
        
        Welcome to srcdoc's Play Engine. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information.
        
        2. Information We Collect
        
        We collect information from you when you visit our site, register on our site, create games, playlists, comments, or write reviews. The types of information we collect include:
        
        - Personal Identification Information: The email address already associated with your account
        
        3. How We Use Your Information
        
        We use the information we collect from you in the following ways:
        
        - To personalize your experience on our site
        - To improve our website based on your feedback
        - To send requested emails (e.g., password resets, and account verification)
        
        4. Protection of Your Information
        
        We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. However, please note that no method of transmission over the Internet, or method of electronic storage, is 100% secure.
        
        5. Sharing of Information
        
        We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
        
        6. Cookies
        
        Our site may use cookies to enhance user experience. Cookies are small text files that are placed on your device to store information. Cookies on our site are required for the site to function properly. Only the following cookies are used on our site:

        - isActive: This cookie is used to determine whether the user has verified their email and is active on the site
        - token: This cookie is used to store the user's session token, needed for interacting with user-specific data that sits behind authentication
        - userId: This cookie is used to store the user's ID, needed for interacting with user-specific data that sits behind authentication
        - username: This cookie is used to store the user's username, needed for displaying the user's username on the site
        
        7. Changes to This Privacy Policy
        
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our site. You are advised to review this Privacy Policy periodically for any changes.
        
        8. Contact Us
        
        If you have any questions about this Privacy Policy, please contact us at support@srcdoc.io.
  `.trim()
	);
}
