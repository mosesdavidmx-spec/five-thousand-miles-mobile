# FIVE THOUSAND MILES Mobile App

Cross-platform Expo starter for Android and iOS.

## Included
- Mobile dashboard
- Available-balance withdrawal screen
- MAX amount button
- Four-digit withdrawal-code field
- Server-side withdrawal validation hook
- Chat/translator interface
- Android and iOS package identifiers

## Important before publishing
The app intentionally does NOT contain a real withdrawal PIN/code. A real financial app must validate authentication and withdrawal authorization on a secure backend.

Set `API_BASE_URL` in `App.js` to your backend. The backend should:
1. Authenticate the signed-in user.
2. Verify the 4-digit withdrawal code securely (preferably hashed).
3. Verify available balance server-side.
4. Create the withdrawal transaction atomically.
5. Apply fraud/AML/KYC controls where legally required.
6. Return `{ "approved": true }` only after the server accepts the transaction.

## Build
Install Node.js, then:

    npm install
    npx expo start

For store builds, use Expo Application Services (EAS):

    npm install -g eas-cli
    eas login
    eas build:configure
    eas build --platform android
    eas build --platform ios

Google Play requires an Android App Bundle (AAB). Apple App Store distribution requires an iOS build and an Apple Developer account.

## Store-readiness
Before submitting, add:
- App icon and splash assets
- Privacy policy URL
- Terms of service
- Support/contact details
- Accurate financial-service disclosures
- Production authentication/backend
- App Store / Google Play compliance review

Do not claim guaranteed profits or misrepresent regulatory authorization.
