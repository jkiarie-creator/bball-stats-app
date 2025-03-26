import { StyleSheet } from 'react-native';
import { COLORS, SIZES, SHADOWS } from './index';

export const StyleGuide = {
  // Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SIZES.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },

  // Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SIZES.md,
    marginVertical: SIZES.sm,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },

  // Buttons
  button: {
    borderRadius: 8,
    padding: SIZES.sm,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },

  // Forms
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.subtext,
    fontSize: SIZES.body,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '500',
    marginBottom: SIZES.xs,
    color: COLORS.text,
  },
  error: {
    color: COLORS.error,
    fontSize: SIZES.caption,
    marginTop: SIZES.xs,
  },

  // Typography
  heading1: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  heading2: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  heading3: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  body: {
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  caption: {
    fontSize: SIZES.caption,
    color: COLORS.subtext,
  },

  // Stats
  statValue: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: SIZES.caption,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: SIZES.xs,
  },

  // Feedback
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: COLORS.success + '20',
    padding: SIZES.sm,
    borderRadius: 8,
    marginVertical: SIZES.sm,
  },
  errorMessage: {
    backgroundColor: COLORS.error + '20',
    padding: SIZES.sm,
    borderRadius: 8,
    marginVertical: SIZES.sm,
  },

  // Navigation
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.subtext + '20',
    ...SHADOWS.light,
  },
  tabBarLabel: {
    fontSize: SIZES.caption,
    fontWeight: '500',
  },
} as const;

export default StyleSheet.create(StyleGuide); 