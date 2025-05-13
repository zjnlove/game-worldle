import { configureStore, combineReducers } from "@reduxjs/toolkit";
import guessesReducer from "./guessesSlice.js";
import answerReducer from "./answerSlice.js";
import guessSelectionReducer from "./guessSelectionSlice.js";
import settingsReducer from "./settingsSlice.js";
import { persistStore, persistReducer } from "redux-persist";
//我已经更新了 store/store.js 文件。
// 改动如下：
// 移除了原来的 import storage from "redux-persist/lib/storage";。
// 引入了 createWebStorage from redux-persist/lib/storage/createWebStorage。
// 添加了一个 createNoopStorage 函数，它返回一个符合 redux-persist 存储接口的对象，但其方法（getItem, setItem, removeItem）不执行任何实际操作，仅返回 resolved Promises。
// 动态创建 storage 对象：
// 检查 typeof window !== "undefined" 来判断是否在浏览器环境中。
// 如果是，则使用 createWebStorage("local")，它会明确使用 localStorage。
// 如果不是（例如在服务器端），则使用 createNoopStorage()。
// 在 persistConfig 中，将 storage 设置为这个动态创建的存储对象。
// 这样修改后，即使在 localStorage 不可用的情况下，应用也应该能够正常初始化 redux-persist，并回退到不持久化任何状态（noop storage），从而避免了之前的报错。
// 请您检查一下问题是否已解决。 
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Function to create a no-operation storage object if localStorage is unavailable
const createNoopStorage = () => {
	return {
		getItem(_key) {
			return Promise.resolve(null);
		},
		setItem(_key, value) {
			return Promise.resolve(value);
		},
		removeItem(_key) {
			return Promise.resolve();
		},
	};
};

// Check if window is defined (i.e., running in a browser environment)
const storage =
	typeof window !== "undefined"
		? createWebStorage("local") // Use localStorage if available
		: createNoopStorage(); // Use noop storage otherwise

const rootReducer = combineReducers({
	guesses: guessesReducer,
	answer: answerReducer,
	guessSelection: guessSelectionReducer,
	settings: settingsReducer,
});

const persistConfig = {
	key: "root",
	storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export let persistor = persistStore(store);
