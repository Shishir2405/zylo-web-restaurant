export const PERSIST_WHITELIST = ["user", "restaurant"];

export const PERSIST_BLACKLIST = [];

export const RTK_ERROR_CODES = Object.freeze({
  fetchError: "FETCH_ERROR",
  parsingError: "PARSING_ERROR",
  timeOutError: "TIMEOUT_ERROR",
  customError: "CUSTOM_ERROR",
});

export const PERSIST_DATA_TIME = 24 * 60 * 60 * 1000;
export const PERSIST_VERSION = 2;

// export const STATE_MIGRATIONS = {
//   [PERSIST_VERSION]: (state: any) => {
//     if (!state) return state;

//     const newState = { ...state };

//     if (state.selectedTranslationUILanguage) {
//       newState.selectedInterFaceLanguage = {
//         flag: state.selectedTranslationUILanguage.flag,
//         label: state.selectedTranslationUILanguage.label || "English (US)",
//         value: state.selectedTranslationUILanguage.value || "en-US",
//         code: state.selectedTranslationUILanguage.code || "en-US",
//       };
//       delete newState.selectedTranslationUILanguage;
//     }

//     if (state.languageList) {
//       newState.interFaceLanguagesList = Array.isArray(state.languageList)
//         ? state.languageList.map((item: any) => ({
//             id: item.id || null,
//             label: item.label || "",
//             value: item.value || "",
//           }))
//         : [];
//       delete newState.languageList;
//     }

//     return newState;
//   },
// };
