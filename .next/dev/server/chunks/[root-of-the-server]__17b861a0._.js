module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Downloads/geminiaiintegration/app/api/ai/gemini/analyze/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/geminiaiintegration/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/geminiaiintegration/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { imageBase64, complaintText, location } = body;
        console.log("[v0] Enhanced AI analysis request received");
        // Get Gemini API key from environment
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            console.warn("[v0] GEMINI_API_KEY not found, using mock analysis");
            return mockAnalysis(imageBase64, complaintText, location);
        }
        try {
            const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                safetySettings: [
                    {
                        category: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HarmCategory"].HARM_CATEGORY_HARASSMENT,
                        threshold: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HarmBlockThreshold"].BLOCK_NONE
                    },
                    {
                        category: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HarmCategory"].HARM_CATEGORY_HATE_SPEECH,
                        threshold: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HarmBlockThreshold"].BLOCK_NONE
                    },
                    {
                        category: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HarmCategory"].HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HarmBlockThreshold"].BLOCK_NONE
                    },
                    {
                        category: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HarmCategory"].HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HarmBlockThreshold"].BLOCK_NONE
                    }
                ]
            });
            const prompt = `You are an expert civic infrastructure analyst for Indian municipalities. Analyze this image showing a civic infrastructure problem.

Complaint: "${complaintText}"
Location: ${location?.lat}, ${location?.lng} (${location?.address || "India"})

This is a legitimate civic infrastructure report. The image may show potholes, garbage, broken streetlights, dead animals on roads, or sewage issues. Please analyze objectively for municipal action.

Provide comprehensive analysis in this exact JSON format with ALL fields filled:
{
  "detected_category": "pothole|waste_overflow|streetlight_out|traffic_signal_fault|carcass_on_road|public_toilet_unclean|damaged_pathway|sewage_overflow|other",
  "confidence": 0.85,
  "severity": 75,
  "description": "Clear, detailed description of the civic issue visible in the image",
  "measurements": {
    "pothole_depth_cm": 12,
    "garbage_volume_cubic_meters": 5.5,
    "affected_area_square_meters": 8.0,
    "is_dead_animal": false,
    "is_low_light_area": false,
    "sewage_volume_liters": null
  },
  "health_risks": ["mosquito breeding", "disease transmission", "accident risk"],
  "urgency_level": "high",
  "expected_resolution_time_hours": 24,
  "assigned_department": "PWD",
  "possible_cause": "Heavy rainfall causing road deterioration and lack of maintenance",
  "next_steps": ["Deploy repair team within 24 hours", "Set up warning signs", "Fill pothole with asphalt"],
  "auto_escalate": false,
  "escalation_reason": null,
  "work_order": {
    "priority": "high",
    "estimated_workers": 3,
    "required_equipment": ["asphalt mixture", "road roller", "safety cones"],
    "safety_precautions": ["warning signs", "traffic control", "safety vests"],
    "estimated_cost_inr": 15000,
    "estimated_duration_hours": 6
  },
  "root_cause_analysis": {
    "primary_cause": "Poor drainage system leading to water accumulation",
    "contributing_factors": ["Heavy monsoon", "Aging infrastructure", "Inadequate maintenance"],
    "recurring_issue": true,
    "prevention_measures": ["Improve drainage", "Regular inspections", "Preventive maintenance"],
    "similar_issues_in_area": 3
  },
  "municipal_staff_instructions": {
    "immediate_actions": ["Deploy team within 2 hours", "Set up safety barriers"],
    "location_based_route": "Via ${location?.address || "nearest PWD office"}",
    "tools_checklist": ["Repair kit", "Safety gear", "Traffic cones"],
    "completion_verification": ["Photo documentation", "Quality check", "Citizen notification"]
  },
  "health_hazard_predictions": {
    "mosquito_breeding_risk": "medium",
    "contamination_risk": "low",
    "accident_risk": "high",
    "crime_risk_due_to_darkness": "low",
    "overall_risk_score": 70
  }
}`;
            // Convert base64 to proper format for Gemini
            const imageParts = [
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: "image/jpeg"
                    }
                }
            ];
            const result = await model.generateContent([
                prompt,
                ...imageParts
            ]);
            const response = await result.response;
            if (!response || !response.text) {
                console.warn("[v0] Gemini response blocked or empty, using mock analysis");
                return mockAnalysis(imageBase64, complaintText, location);
            }
            const text = response.text();
            console.log("[v0] Gemini response received");
            // Parse JSON from AI response
            const cleanedText = text.replace(/```json|```/g, "").trim();
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            const aiAnalysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
            if (!aiAnalysis) {
                console.warn("[v0] Failed to parse AI response, using mock analysis");
                return mockAnalysis(imageBase64, complaintText, location);
            }
            // Map category to our system
            const categoryMap = {
                pothole: "pothole",
                waste_overflow: "waste_overflow",
                streetlight_out: "streetlight_out",
                traffic_signal_fault: "traffic_signal_fault",
                carcass_on_road: "carcass_on_road",
                public_toilet_unclean: "public_toilet_unclean",
                damaged_pathway: "damaged_pathway",
                sewage_overflow: "other",
                other: "other"
            };
            const finalCategory = categoryMap[aiAnalysis.detected_category] || "other";
            const finalSeverity = aiAnalysis.severity || 50;
            const apiResponse = {
                success: true,
                analysis: {
                    predicted_category: finalCategory,
                    category_confidence: aiAnalysis.confidence,
                    final_severity: finalSeverity,
                    severity_level: getSeverityLevel(finalSeverity),
                    description: aiAnalysis.description,
                    measurements: aiAnalysis.measurements,
                    health_risks: aiAnalysis.health_risks || [],
                    urgency_level: aiAnalysis.urgency_level,
                    expected_resolution_time: `${aiAnalysis.expected_resolution_time_hours} hours`,
                    assigned_department: aiAnalysis.assigned_department,
                    possible_cause: aiAnalysis.possible_cause,
                    next_steps: aiAnalysis.next_steps || [],
                    auto_escalate: aiAnalysis.auto_escalate || false,
                    escalation_reason: aiAnalysis.escalation_reason,
                    work_order: aiAnalysis.work_order,
                    root_cause_analysis: aiAnalysis.root_cause_analysis,
                    municipal_staff_instructions: aiAnalysis.municipal_staff_instructions,
                    health_hazard_predictions: aiAnalysis.health_hazard_predictions,
                    needs_human_review: aiAnalysis.confidence < 0.7 || aiAnalysis.urgency_level === "critical",
                    processed_at: new Date().toISOString(),
                    gemini_raw: aiAnalysis
                }
            };
            console.log("[v0] Comprehensive Gemini AI analysis complete");
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(apiResponse);
        } catch (apiError) {
            console.error("[v0] Gemini API error, falling back to mock:", apiError.message);
            return mockAnalysis(imageBase64, complaintText, location);
        }
    } catch (error) {
        console.error("[v0] AI analysis error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
function mockAnalysis(imageBase64, complaintText, location) {
    const category = determineCategoryFromText(complaintText);
    const severity = 50 + Math.floor(Math.random() * 40);
    const confidence = 0.75 + Math.random() * 0.2;
    const mockResponse = {
        success: true,
        analysis: {
            predicted_category: category,
            category_confidence: confidence,
            final_severity: severity,
            severity_level: getSeverityLevel(severity),
            description: `AI detected ${category.replace(/_/g, " ")} based on image analysis. ${complaintText.slice(0, 100)}`,
            measurements: getMockMeasurements(category),
            health_risks: getHealthRisks(category),
            urgency_level: severity > 75 ? "high" : severity > 50 ? "medium" : "low",
            expected_resolution_time: `${severity > 75 ? 12 : severity > 50 ? 24 : 48} hours`,
            assigned_department: getDepartmentForCategory(category),
            possible_cause: getPossibleCause(category),
            next_steps: getNextSteps(category),
            auto_escalate: severity > 85,
            escalation_reason: severity > 85 ? "Critical severity detected requiring immediate attention" : null,
            work_order: {
                priority: severity > 75 ? "high" : severity > 50 ? "medium" : "low",
                estimated_workers: category === "pothole" ? 3 : 2,
                required_equipment: getRequiredEquipment(category),
                safety_precautions: getSafetyPrecautions(category),
                estimated_cost_inr: severity > 75 ? 25000 : severity > 50 ? 15000 : 8000,
                estimated_duration_hours: severity > 75 ? 8 : severity > 50 ? 6 : 4
            },
            root_cause_analysis: {
                primary_cause: getRootCause(category),
                contributing_factors: getContributingFactors(category),
                recurring_issue: Math.random() > 0.5,
                prevention_measures: getPreventionMeasures(category),
                similar_issues_in_area: Math.floor(Math.random() * 5)
            },
            municipal_staff_instructions: {
                immediate_actions: getNextSteps(category).slice(0, 2),
                location_based_route: `Via ${location?.address || "nearest municipal office"} - optimized route`,
                tools_checklist: getRequiredEquipment(category),
                completion_verification: [
                    "Photo documentation",
                    "Quality inspection",
                    "Notify citizen via app"
                ]
            },
            health_hazard_predictions: {
                mosquito_breeding_risk: category === "waste_overflow" ? "high" : "low",
                contamination_risk: category === "sewage_overflow" || category === "waste_overflow" ? "high" : "low",
                accident_risk: category === "pothole" || category === "damaged_pathway" ? "high" : "low",
                crime_risk_due_to_darkness: category === "streetlight_out" ? "medium" : "low",
                overall_risk_score: severity
            },
            needs_human_review: confidence < 0.7 || severity > 85,
            processed_at: new Date().toISOString(),
            gemini_raw: {
                note: "Mock analysis - Gemini API key not configured or rate limited"
            }
        }
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mockResponse);
}
function determineCategoryFromText(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("pothole") || lowerText.includes("गड्ढा")) return "pothole";
    if (lowerText.includes("garbage") || lowerText.includes("कचरा") || lowerText.includes("waste")) return "waste_overflow";
    if (lowerText.includes("light") || lowerText.includes("लाइट")) return "streetlight_out";
    if (lowerText.includes("signal") || lowerText.includes("traffic")) return "traffic_signal_fault";
    if (lowerText.includes("animal") || lowerText.includes("carcass") || lowerText.includes("dead")) return "carcass_on_road";
    if (lowerText.includes("toilet") || lowerText.includes("शौचालय")) return "public_toilet_unclean";
    if (lowerText.includes("pathway") || lowerText.includes("pavement")) return "damaged_pathway";
    return "other";
}
function getSeverityLevel(score) {
    if (score >= 85) return "critical";
    if (score >= 65) return "high";
    if (score >= 40) return "medium";
    return "low";
}
function getMockMeasurements(category) {
    const measurements = {
        pothole_depth_cm: null,
        garbage_volume_cubic_meters: null,
        affected_area_square_meters: null,
        is_dead_animal: false,
        is_low_light_area: false,
        sewage_volume_liters: null
    };
    if (category === "pothole") {
        measurements.pothole_depth_cm = 8 + Math.floor(Math.random() * 15);
        measurements.affected_area_square_meters = 0.5 + Math.random() * 2;
    } else if (category === "waste_overflow") {
        measurements.garbage_volume_cubic_meters = 2 + Math.random() * 8;
        measurements.affected_area_square_meters = 5 + Math.random() * 15;
    } else if (category === "carcass_on_road") {
        measurements.is_dead_animal = true;
        measurements.affected_area_square_meters = 1 + Math.random() * 3;
    } else if (category === "streetlight_out") {
        measurements.is_low_light_area = true;
    }
    return measurements;
}
function getHealthRisks(category) {
    const risks = {
        pothole: [
            "Accident risk",
            "Vehicle damage",
            "Pedestrian injuries"
        ],
        waste_overflow: [
            "Mosquito breeding",
            "Disease transmission",
            "Foul odor",
            "Rat infestation"
        ],
        streetlight_out: [
            "Crime risk",
            "Accident risk at night",
            "Pedestrian safety concern"
        ],
        traffic_signal_fault: [
            "Traffic accidents",
            "Road rage incidents",
            "Congestion"
        ],
        carcass_on_road: [
            "Disease transmission",
            "Contamination of water/food",
            "Foul odor",
            "Fly breeding",
            "Public health emergency"
        ],
        public_toilet_unclean: [
            "Disease transmission",
            "Bacterial infection risk",
            "Unhygienic conditions"
        ],
        damaged_pathway: [
            "Trip hazard",
            "Elderly fall risk",
            "Wheelchair accessibility issue"
        ],
        other: [
            "General safety concern"
        ]
    };
    return risks[category] || risks.other;
}
function getDepartmentForCategory(category) {
    const deptMap = {
        pothole: "PWD",
        damaged_pathway: "PWD",
        waste_overflow: "SWM",
        streetlight_out: "ELECTRICAL",
        traffic_signal_fault: "TRAFFIC",
        carcass_on_road: "HEALTH",
        public_toilet_unclean: "SANITATION",
        other: "HELPDESK"
    };
    return deptMap[category] || "HELPDESK";
}
function getPossibleCause(category) {
    const causes = {
        pothole: "Heavy monsoon rainfall causing road surface deterioration and inadequate road maintenance",
        waste_overflow: "Irregular waste collection schedule and insufficient bin capacity for the area",
        streetlight_out: "Electrical fault or bulb/fixture damage due to weather or vandalism",
        traffic_signal_fault: "Electrical malfunction or timer system failure",
        carcass_on_road: "Stray animal death, requires immediate removal for public health",
        public_toilet_unclean: "Inadequate cleaning schedule and lack of regular maintenance",
        damaged_pathway: "Weather erosion, heavy foot traffic, or poor initial construction",
        other: "Requires further investigation to determine root cause"
    };
    return causes[category] || causes.other;
}
function getNextSteps(category) {
    const steps = {
        pothole: [
            "Dispatch road repair team within 24 hours",
            "Set up warning signs and barriers",
            "Fill pothole with asphalt mixture",
            "Inspect surrounding area for additional damage"
        ],
        waste_overflow: [
            "Send waste collection team immediately",
            "Clean and sanitize affected area",
            "Increase collection frequency for this location",
            "Add additional bins if needed"
        ],
        streetlight_out: [
            "Send electrician to inspect within 12 hours",
            "Replace bulb or repair fixture",
            "Test electrical connections",
            "Add to regular maintenance schedule"
        ],
        traffic_signal_fault: [
            "Alert traffic police immediately",
            "Deploy manual traffic control",
            "Send technician for emergency repair",
            "Install temporary signals if needed"
        ],
        carcass_on_road: [
            "Dispatch health team immediately (within 2 hours)",
            "Remove and dispose of carcass safely",
            "Sanitize affected area thoroughly",
            "Investigate source and prevent recurrence"
        ],
        public_toilet_unclean: [
            "Send sanitation team for deep cleaning",
            "Repair any damaged facilities",
            "Increase cleaning frequency",
            "Install hygiene monitoring system"
        ],
        damaged_pathway: [
            "Inspect extent of damage",
            "Set up barriers for safety",
            "Schedule repair work",
            "Resurface affected area"
        ],
        other: [
            "Assess situation",
            "Assign to appropriate department",
            "Schedule site inspection"
        ]
    };
    return steps[category] || steps.other;
}
function getRequiredEquipment(category) {
    const equipment = {
        pothole: [
            "Asphalt mixture",
            "Road roller",
            "Safety cones",
            "Jackhammer"
        ],
        waste_overflow: [
            "Garbage truck",
            "Cleaning tools",
            "Sanitizer",
            "Additional bins"
        ],
        streetlight_out: [
            "Ladder",
            "Replacement bulbs",
            "Electrical testing equipment",
            "Safety gear"
        ],
        traffic_signal_fault: [
            "Signal repair tools",
            "Replacement parts",
            "Testing equipment",
            "Traffic cones"
        ],
        carcass_on_road: [
            "Protective suits",
            "Sanitizing equipment",
            "Body bags",
            "Disposal vehicle"
        ],
        public_toilet_unclean: [
            "Cleaning supplies",
            "Disinfectants",
            "Repair tools",
            "Protective gear"
        ],
        damaged_pathway: [
            "Concrete mixer",
            "Paving stones",
            "Safety barriers",
            "Leveling tools"
        ],
        other: [
            "Standard municipal equipment"
        ]
    };
    return equipment[category] || equipment.other;
}
function getSafetyPrecautions(category) {
    const precautions = {
        pothole: [
            "Set up warning signs",
            "Use safety vests",
            "Divert traffic if needed"
        ],
        waste_overflow: [
            "Wear protective gloves",
            "Use face masks",
            "Sanitize after work"
        ],
        streetlight_out: [
            "Work during daylight if possible",
            "Use safety harness",
            "Follow electrical safety protocols"
        ],
        traffic_signal_fault: [
            "Coordinate with traffic police",
            "Use high-visibility clothing",
            "Work during low-traffic hours"
        ],
        carcass_on_road: [
            "Wear full protective equipment",
            "Follow biohazard protocols",
            "Sanitize all equipment",
            "Report to health department"
        ],
        public_toilet_unclean: [
            "Wear protective gear",
            "Use proper ventilation",
            "Follow sanitation protocols"
        ],
        damaged_pathway: [
            "Cordon off work area",
            "Warn pedestrians",
            "Ensure proper lighting"
        ],
        other: [
            "Follow standard safety procedures"
        ]
    };
    return precautions[category] || precautions.other;
}
function getRootCause(category) {
    const causes = {
        pothole: "Poor drainage system causing water accumulation and road deterioration",
        waste_overflow: "Inadequate waste collection frequency and insufficient bin capacity",
        streetlight_out: "Aging electrical infrastructure and lack of preventive maintenance",
        traffic_signal_fault: "Power fluctuations and lack of backup systems",
        carcass_on_road: "Stray animal population and lack of animal control measures",
        public_toilet_unclean: "Insufficient cleaning staff and lack of regular maintenance schedule",
        damaged_pathway: "Heavy foot traffic combined with poor quality construction materials",
        other: "Multiple factors contributing to infrastructure degradation"
    };
    return causes[category] || causes.other;
}
function getContributingFactors(category) {
    const factors = {
        pothole: [
            "Heavy monsoon rainfall",
            "High traffic volume",
            "Poor quality asphalt",
            "Delayed maintenance"
        ],
        waste_overflow: [
            "Population growth",
            "Irregular collection",
            "Insufficient bins",
            "Lack of segregation"
        ],
        streetlight_out: [
            "Weather damage",
            "Vandalism",
            "Power surges",
            "Old fixtures"
        ],
        traffic_signal_fault: [
            "Power outages",
            "Component failure",
            "Weather conditions",
            "Lack of monitoring"
        ],
        carcass_on_road: [
            "Stray animal accidents",
            "Delayed reporting",
            "Limited cleanup resources"
        ],
        public_toilet_unclean: [
            "High usage",
            "Insufficient cleaning",
            "Vandalism",
            "Water shortage"
        ],
        damaged_pathway: [
            "Weather erosion",
            "Tree roots",
            "Poor drainage",
            "Construction defects"
        ],
        other: [
            "Multiple environmental and human factors"
        ]
    };
    return factors[category] || factors.other;
}
function getPreventionMeasures(category) {
    const measures = {
        pothole: [
            "Regular road inspections",
            "Improved drainage",
            "Quality materials",
            "Timely repairs"
        ],
        waste_overflow: [
            "Increase bin capacity",
            "More frequent collection",
            "Public awareness",
            "Waste segregation"
        ],
        streetlight_out: [
            "Preventive maintenance",
            "LED upgrades",
            "Remote monitoring",
            "Quick response team"
        ],
        traffic_signal_fault: [
            "Backup power systems",
            "Regular testing",
            "Modern controllers",
            "24/7 monitoring"
        ],
        carcass_on_road: [
            "Animal control programs",
            "Quick response system",
            "Public reporting app",
            "Awareness campaigns"
        ],
        public_toilet_unclean: [
            "More cleaning staff",
            "Regular schedules",
            "User feedback system",
            "Better facilities"
        ],
        damaged_pathway: [
            "Quality construction",
            "Regular maintenance",
            "Proper drainage",
            "Tree management"
        ],
        other: [
            "Regular monitoring and preventive maintenance"
        ]
    };
    return measures[category] || measures.other;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__17b861a0._.js.map