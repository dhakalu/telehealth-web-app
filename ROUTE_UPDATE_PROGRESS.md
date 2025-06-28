# Route Title Update Progress

## COMPLETED ROUTES (Updated with usePageTitle):

### Auth Routes:
- ✅ `_auth.login.tsx` - "Login to MedTok"
- ✅ `_auth.provider.signup.tsx` - "Sign Up as Provider - MedTok" 
- ✅ `verify-email.tsx` - "Email Verification - MedTok"
- ✅ `help.tsx` - "Help & Support - MedTok"

### Patient Routes:
- ✅ `patient/qa.tsx` - Already updated (from previous session)
- ✅ `patient/providers.tsx` - Already updated (from previous session)
- ✅ `patient/complete-profile.tsx` - Already updated (from previous session)
- ✅ `patient/allergy.tsx` - "Allergies"
- ✅ `patient/health-condition.tsx` - "Health Conditions - Patient - MedTok"
- ✅ `patient/medication.tsx` - "Medications - Patient - MedTok"
- ✅ `patient/immunization.tsx` - "Immunizations - Patient - MedTok"
- ✅ `patient/find-doctors.tsx` - "Find Doctors - Patient - MedTok"
- ✅ `patient/estimates.tsx` - "Cost Estimate - Patient - MedTok"
- ✅ `patient/chat.tsx` - "Chat - Patient - MedTok"

### Provider Routes:
- ✅ `provider/index.tsx` - "Provider Dashboard - MedTok"
- ✅ `provider/complete-profile.tsx` - "Complete Profile - Provider - MedTok"
- ✅ `provider/patients.tsx` - "Patients - Provider - MedTok"
- ✅ `provider/schedules.tsx` - "Schedules - Provider - MedTok"
- ✅ `provider/allergy.tsx` - "Patient Allergies - Provider - MedTok"
- ✅ `provider/medication.tsx` - "Patient Medications - Provider - MedTok"
- ✅ `provider/immunization.tsx` - "Patient Immunizations - Provider - MedTok"
- ✅ `provider/chat.tsx` - "Chat - Provider - MedTok"

### Main Routes:
- ✅ `_index.tsx` - Already updated (from previous session)

## REMAINING ROUTES TO UPDATE:

### Patient Routes:
- ⏳ `patient/by-id-index.tsx`
- ⏳ `patient/by-id.tsx`
- ⏳ `patient/doctor-profile.tsx`
- ⏳ `patient/procedure.tsx`
- ⏳ `patient/route.tsx` (layout route - may not need title)

### Provider Routes:
- ⏳ `provider/calendar.tsx`
- ⏳ `provider/health-condition.tsx`
- ⏳ `provider/patient-by-id.tsx`
- ⏳ `provider/patients_index.tsx`
- ⏳ `provider/procedure.tsx`
- ⏳ `provider/route.tsx` (layout route - may not need title)
- ⏳ `provider/schedules-create.tsx`
- ⏳ `provider/schedules-update.tsx`

### Auth Routes:
- ⏳ `_auth.logout.tsx` (redirect only - no title needed)

## PATTERN FOR UPDATING:

1. Add import: `import { usePageTitle } from "~/hooks";`
2. Add hook call at start of component: `usePageTitle("Your Title Here");`
3. Use descriptive titles following the pattern: "[Page Name] - [User Type] - MedTok"

## SUGGESTED TITLES FOR REMAINING ROUTES:

- `patient/doctor-profile.tsx` - "Doctor Profile - Patient - MedTok"
- `patient/procedure.tsx` - "Procedures - Patient - MedTok"
- `provider/calendar.tsx` - "Calendar - Provider - MedTok"  
- `provider/health-condition.tsx` - "Patient Health Conditions - Provider - MedTok"
- `provider/patient-by-id.tsx` - "Patient Details - Provider - MedTok"
- `provider/patients_index.tsx` - "Patient List - Provider - MedTok"
- `provider/procedure.tsx` - "Patient Procedures - Provider - MedTok"
- `provider/schedules-create.tsx` - "Create Schedule - Provider - MedTok"
- `provider/schedules-update.tsx` - "Update Schedule - Provider - MedTok"

## NOTES:
- Route files (route.tsx) are layout components and typically don't need titles
- Redirect-only components (_auth.logout.tsx, patient/index.tsx) don't need titles
- All layout logic is already in place in root.tsx with TitleProvider and DynamicTitle
