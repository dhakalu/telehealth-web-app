import { type RouteConfig } from "@react-router/dev/routes";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";

export default remixRoutesOptionAdapter((defineRoutes) => {
  return defineRoutes((route) => {
    route("/", "./routes/_index.tsx", { index: true });
    route("/login", "./routes/_auth.login.tsx");
    route("/patient", "./routes/patient/route.tsx", () => {
      route("", "./routes/patient/index.tsx", { index: true });
      route("complete-profile", "./routes/patient/complete-profile.tsx");
      route("chat/:practitioner", "./routes/patient/chat.tsx");
      route("find-doctors", "./routes/patient/find-doctors.tsx");
      route("estimates/:providerId/:questionnaireId", "./routes/patient/estimates.tsx");
      route("profile/:doctorId", "./routes/patient/doctor-profile.tsx");
      route("qa/:providerId", "./routes/patient/qa.tsx");
      route("providers", "./routes/patient/providers.tsx")
      route(":patientId", "./routes/patient/by-id.tsx", () => {
        route("", "./routes/patient/by-id-index.tsx", { index: true })
        route("allergy", "./routes/patient/allergy.tsx");
        route("prescription", "./routes/patient/prescription.tsx");
        route("medication", "./routes/patient/medication.tsx");
        route("immunization", "./routes/patient/immunization.tsx");
        route("health-condition", "./routes/patient/health-condition.tsx");
        route("procedure", "./routes/patient/procedure.tsx");

        // // route("vital", "./routes/common/vital/index.tsx");
        // route("result", "./routes/common/result/index.tsx");
      });
    });
    route("/signup", "./routes/_auth.provider.signup.tsx");
    route("/logout", "./routes/_auth.logout.tsx");
    route("/verify-email", "./routes/verify-email.tsx");
    route("/help", "./routes/help.tsx")
    route("/provider", "./routes/provider/route.tsx", () => {
      route("", "./routes/provider/index.tsx", { index: true });
      route("account-status", "./routes/provider/account-status.tsx");
      route("calendar", "./routes/provider/calendar.tsx");
      route("schedules/create", "./routes/provider/schedules-create.tsx");
      route("schedules/:scheduleId", "./routes/provider/schedules-update.tsx");
      route("schedules", "./routes/provider/schedules.tsx");
      route("complete-profile", "./routes/provider/complete-profile.tsx");
      route("patients", "./routes/provider/patients.tsx", () => {
        route("", "./routes/provider/patients_index.tsx", { index: true })
        route(":patientId", "./routes/provider/patient-by-id.tsx", () => {
          route("chat", "./routes/provider/chat.tsx");
          route("allergy", "./routes/provider/allergy.tsx");
          route("prescription", "./routes/provider/prescription.tsx");
          route("medication", "./routes/provider/medication.tsx");
          route("immunization", "./routes/provider/immunization.tsx");
          route("health-condition", "./routes/provider/health-condition.tsx");
          route("procedure", "./routes/provider/procedure.tsx");
          route("family-health-condition", "./routes/provider/family-health-condition.tsx");
          route("vital", "./routes/provider/vitals.tsx");
          route("result", "./routes/provider/results.tsx");
        });
      });
    });
    route("/support", "./routes/support/route.tsx", () => {
      route("", "./routes/support/_index.tsx", { index: true });
      route("complete-profile/:userId", "./routes/support/complete-profile.tsx");
      route("team-management", "./routes/support/team-management.tsx");
      route("manage-organizations", "./routes/support/manage-organizations.tsx");
      route("manage-organizations/:organizationId", "./routes/support/create-update-organization.tsx");
      route("approval/practitioner/:userId", "./routes/support/practitioner-approval.tsx");
    });
    route("/pharmacist", "./routes/pharmacist/route.tsx", () => {
      route("complete-profile", "./routes/pharmacist/complete-profile.tsx");
      route("account-status", "./routes/pharmacist/account-status.tsx");
      // route("prescriptions", "./routes/pharmacist/prescriptions.tsx");
    })
  });
}) satisfies RouteConfig;
