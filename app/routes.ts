import { type RouteConfig } from "@react-router/dev/routes";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";

export default remixRoutesOptionAdapter((defineRoutes) => {
  return defineRoutes((route) => {
    route("/", "./routes/_index.tsx", { index: true });
    route("/login", "./routes/_auth.login.tsx");
    route("/patient", "./routes/patient/route.tsx", () => {
      route("complete-profile", "./routes/patient/complete-profile.tsx");
      route("chat/:practitioner", "./routes/patient/chat.tsx");
      route("find-doctors", "./routes/patient/find-doctors.tsx");
      route("estimates/:providerId/:questionnaireId", "./routes/patient/estimates.tsx");
      route("profile/:doctorId", "./routes/patient/doctor-profile.tsx");
      route("qa/:providerId", "./routes/patient/qa.tsx");
      route(":patientId", "./routes/patient/index.tsx", () => {
          // route("allergy", "./routes/common/allergy/index.tsx");
          // route("medication", "./routes/common/medication/index.tsx");
          // route("immunization", "./routes/common/immunization/index.tsx");
          // route("health-condition", "./routes/common/health-condition/index.tsx");
          // route("procedure", "./routes/common/procedures/index.tsx");
          // // route("vital", "./routes/common/vital/index.tsx");
          // route("result", "./routes/common/result/index.tsx");
      });
    });
    route("/provider", "./routes/provider/route.tsx", () => {
      route("", "./routes/provider/index.tsx", { index: true });
      route("complete-profile", "./routes/provider/complete-profile.tsx");
      route("patients", "./routes/provider/patients.tsx", () => {
        route(":patientId", "./routes/provider/patient-by-id.tsx", () => {
          route("chat", "./routes/provider/chat.tsx");
          route("allergy", "./routes/common/allergy/index.tsx");
          route("medication", "./routes/common/medication/index.tsx");
          route("immunization", "./routes/common/immunization/index.tsx");
          route("health-condition", "./routes/common/health-condition/index.tsx");
          route("procedure", "./routes/common/procedures/index.tsx");
          // route("vital", "./routes/common/vital/index.tsx");
          // route("result", "./routes/common/result/index.tsx");
        });    
      });
    });
  });
}) satisfies RouteConfig;
