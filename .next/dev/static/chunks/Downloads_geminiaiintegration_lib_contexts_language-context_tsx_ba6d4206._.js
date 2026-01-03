(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/geminiaiintegration/lib/contexts/language-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/geminiaiintegration/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/geminiaiintegration/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Translation dictionary
const translations = {
    // Common
    "app.name": {
        en: "CivicFlow",
        hi: "सिविकफ्लो"
    },
    "app.tagline": {
        en: "Civic Reporting Platform",
        hi: "नागरिक रिपोर्टिंग मंच"
    },
    "search.placeholder": {
        en: "Search reports, addresses, IDs...",
        hi: "रिपोर्ट, पते, आईडी खोजें..."
    },
    language: {
        en: "Language",
        hi: "भाषा"
    },
    // Admin Dashboard
    "admin.dashboard": {
        en: "Dashboard",
        hi: "डैशबोर्ड"
    },
    "admin.reports": {
        en: "Reports",
        hi: "रिपोर्ट"
    },
    "admin.map": {
        en: "Map View",
        hi: "मानचित्र दृश्य"
    },
    "admin.review": {
        en: "Human Review",
        hi: "मानव समीक्षा"
    },
    "admin.workers": {
        en: "Workers",
        hi: "कार्यकर्ता"
    },
    "admin.departments": {
        en: "Departments",
        hi: "विभाग"
    },
    "admin.analytics": {
        en: "Analytics",
        hi: "विश्लेषण"
    },
    "admin.audit": {
        en: "Audit Logs",
        hi: "ऑडिट लॉग"
    },
    "admin.settings": {
        en: "Settings",
        hi: "सेटिंग्स"
    },
    "admin.panel": {
        en: "Admin Panel",
        hi: "प्रशासन पैनल"
    },
    // Stats
    "stats.total_open": {
        en: "Total Open Reports",
        hi: "कुल खुली रिपोर्ट"
    },
    "stats.resolved_today": {
        en: "Resolved Today",
        hi: "आज हल किया"
    },
    "stats.avg_time": {
        en: "Avg Resolution Time",
        hi: "औसत समय"
    },
    "stats.needs_review": {
        en: "Needs Human Review",
        hi: "मानव समीक्षा चाहिए"
    },
    "stats.active_workers": {
        en: "Active Workers",
        hi: "सक्रिय कार्यकर्ता"
    },
    // Report statuses
    "status.submitted": {
        en: "Submitted",
        hi: "प्रस्तुत"
    },
    "status.assigned": {
        en: "Assigned",
        hi: "सौंपा गया"
    },
    "status.in_progress": {
        en: "In Progress",
        hi: "प्रगति में"
    },
    "status.completed": {
        en: "Completed",
        hi: "पूर्ण"
    },
    "status.verified": {
        en: "Verified",
        hi: "सत्यापित"
    },
    "status.needs_human_review": {
        en: "Needs Review",
        hi: "समीक्षा चाहिए"
    },
    // Severity
    "severity.low": {
        en: "Low",
        hi: "कम"
    },
    "severity.medium": {
        en: "Medium",
        hi: "मध्यम"
    },
    "severity.high": {
        en: "High",
        hi: "उच्च"
    },
    "severity.critical": {
        en: "Critical",
        hi: "गंभीर"
    },
    // Actions
    "action.view": {
        en: "View",
        hi: "देखें"
    },
    "action.edit": {
        en: "Edit",
        hi: "संपादित करें"
    },
    "action.delete": {
        en: "Delete",
        hi: "हटाएं"
    },
    "action.assign": {
        en: "Assign",
        hi: "सौंपें"
    },
    "action.approve": {
        en: "Approve",
        hi: "स्वीकार करें"
    },
    "action.reject": {
        en: "Reject",
        hi: "अस्वीकार करें"
    },
    "action.logout": {
        en: "Logout",
        hi: "लॉग आउट"
    },
    // Categories
    "category.pothole": {
        en: "Pothole",
        hi: "गड्ढा"
    },
    "category.waste_overflow": {
        en: "Waste Overflow",
        hi: "कचरा अतिप्रवाह"
    },
    "category.streetlight_out": {
        en: "Streetlight Out",
        hi: "स्ट्रीट लाइट बंद"
    },
    "category.traffic_signal": {
        en: "Traffic Signal Fault",
        hi: "ट्रैफिक सिग्नल खराब"
    },
    "category.other": {
        en: "Other",
        hi: "अन्य"
    }
};
function LanguageProvider({ children }) {
    _s();
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("en");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LanguageProvider.useEffect": ()=>{
            // Load language from localStorage
            const saved = localStorage.getItem("civicflow-language");
            if (saved === "en" || saved === "hi") {
                setLanguage(saved);
            }
        }
    }["LanguageProvider.useEffect"], []);
    const handleSetLanguage = (lang)=>{
        setLanguage(lang);
        localStorage.setItem("civicflow-language", lang);
    };
    const t = (key)=>{
        return translations[key]?.[language] || key;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            language,
            setLanguage: handleSetLanguage,
            t
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Downloads/geminiaiintegration/lib/contexts/language-context.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s(LanguageProvider, "yypZwmBAMeNoFNht2MZkioB5628=");
_c = LanguageProvider;
function useLanguage() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$geminiaiintegration$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
_s1(useLanguage, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "LanguageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_geminiaiintegration_lib_contexts_language-context_tsx_ba6d4206._.js.map