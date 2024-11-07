"use strict";
// src/myModule.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_NAME = exports.PI = void 0;
exports.sayHello = sayHello;
exports.add = add;
exports.calculateCircleArea = calculateCircleArea;
exports.logAppInfo = logAppInfo;
// Константы
exports.PI = 3.14159;
exports.APP_NAME = "Payload Generator Server";
// Функция для приветствия
function sayHello(name) {
    return `Hello, ${name}!`;
}
// Функция для сложения двух чисел
function add(a, b) {
    return a + b;
}
// Функция для вычисления площади круга
function calculateCircleArea(radius) {
    return exports.PI * radius * radius;
}
// Функция для логирования сообщения с информацией о приложении
function logAppInfo() {
    console.log(`Welcome to ${exports.APP_NAME}`);
}
