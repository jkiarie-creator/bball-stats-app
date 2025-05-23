# Deployment Checklist for Basketball Stats App

Use this checklist to ensure your app is ready for deployment to app stores.

## 1. Code Quality and Testing

- [ ] All TypeScript errors are resolved or acknowledged
- [ ] All lint warnings are addressed
- [ ] All critical paths have test coverage
- [ ] Manual testing of main features completed
- [ ] Performance testing completed

## 2. Build Verification

- [ ] Run `npm run verify-build` with no critical errors
- [ ] Performed test build with `npm run build-test`
- [ ] Tested on physical Android device
- [ ] Tested on physical iOS device (if applicable)

## 3. Assets and Configuration

- [ ] App icon set up correctly in all required sizes
- [ ] Splash screen configured properly
- [ ] All required permissions listed in app.json
- [ ] Version and build numbers updated
- [ ] Firebase configuration validated

## 4. Store Listing Preparation

- [ ] App screenshots prepared for all required devices
- [ ] App description written
- [ ] Privacy policy created and hosted
- [ ] Keywords selected for App Store optimization
- [ ] Content rating questionnaire completed

## 5. Release Management

- [ ] Release notes written
- [ ] Changelog updated
- [ ] Git tag created for release version
- [ ] GitHub release created (if using GitHub)

## 6. Backend Services

- [ ] Firebase rules reviewed and secured
- [ ] API endpoints tested and validated
- [ ] Database backup procedures in place
- [ ] Analytics tracking implemented

## 7. Pre-Launch Checks

- [ ] Deep links tested
- [ ] Push notifications tested
- [ ] In-app purchases tested (if applicable)
- [ ] Network disconnection handling tested
- [ ] Accessibility features tested

## 8. Post-Launch Plan

- [ ] Monitoring plan established
- [ ] User feedback collection strategy in place
- [ ] Bug reporting mechanism implemented
- [ ] Update roadmap defined

## Final Approval

- [ ] Technical lead sign-off
- [ ] Product manager sign-off
- [ ] QA sign-off

---

## Common Issues to Check

1. **Path alias issues**: Ensure Metro config, babel.config.js, and tsconfig.json are properly aligned
2. **Firebase credentials**: Verify that all Firebase services are properly initialized
3. **API keys exposure**: Make sure sensitive API keys are not exposed in public repositories
4. **Performance issues**: Check for memory leaks and unnecessary re-renders
5. **Permission handling**: Ensure all required permissions are properly requested and handled

## Known Type Errors

Below are known TypeScript errors that don't affect app functionality:

1. **Path alias resolution**: TypeScript may show errors for `@/` imports but they work at runtime
2. **Third-party library types**: Some libraries like `lottie-react-native` have incomplete types
3. **React Navigation types**: Some navigation prop types may show errors but work correctly
4. **Redux state types**: Some complex state types may need refinement

## Quick Reference Commands

```bash
# Verify build
npm run verify-build

# Create a test build
npm run build-test

# Create production build with EAS
eas build --platform android --profile production

# Submit to app stores
eas submit -p android
eas submit -p ios
```
