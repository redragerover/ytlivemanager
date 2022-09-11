import { jest } from "@jest/globals";

import { handleDoubleCheck } from "../ytLiveState";
describe("handleDoubleCheck", () => {
  it("should not call functions when doubleCheckIfOffline is false", () => {
    const actionWhenDoubleCheckIsTrue = jest.fn();
    const setDoubleCheckIfOffline = jest.fn();
    const setStreamIsAlreadyOnline = jest.fn();
    const state = {
      doubleCheckIfOffline: false,
      setDoubleCheckIfOffline,
      setStreamIsAlreadyOnline,
    };
    const isStreaming = false;
    handleDoubleCheck(state, actionWhenDoubleCheckIsTrue, isStreaming);
    expect(actionWhenDoubleCheckIsTrue).not.toHaveBeenCalled();
    expect(setDoubleCheckIfOffline).not.toHaveBeenCalled();
    expect(setStreamIsAlreadyOnline).not.toHaveBeenCalled();
  });
  it("doubleCheckIfOffline is true and if isStreaming, then state should reflect a stream is in progress", () => {
    const actionWhenDoubleCheckIsTrue = jest.fn();
    const setDoubleCheckIfOffline = jest.fn();
    const setStreamIsAlreadyOnline = jest.fn();
    const state = {
      doubleCheckIfOffline: true,
      setDoubleCheckIfOffline,
      setStreamIsAlreadyOnline,
    };
    const isStreaming = true;

    handleDoubleCheck(state, actionWhenDoubleCheckIsTrue, isStreaming);

    expect(actionWhenDoubleCheckIsTrue).not.toHaveBeenCalled();
    expect(setDoubleCheckIfOffline).toHaveBeenCalledWith(false);
    expect(setStreamIsAlreadyOnline).toHaveBeenCalledWith(true);
    expect(setDoubleCheckIfOffline).toHaveBeenCalledTimes(1);
    expect(setStreamIsAlreadyOnline).toHaveBeenCalledTimes(1);
  });

  it("doubleCheckIfOffline is true and if !isStreaming, then actionWhenDoubleCheckIsTrue is called, then state shouldreflect a stream entering offline status", () => {
    {
      const actionWhenDoubleCheckIsTrue = jest.fn();
      const setDoubleCheckIfOffline = jest.fn();
      const setStreamIsAlreadyOnline = jest.fn();
      const state = {
        doubleCheckIfOffline: true,
        setDoubleCheckIfOffline,
        setStreamIsAlreadyOnline,
      };

      const isStreaming = false;

      handleDoubleCheck(state, actionWhenDoubleCheckIsTrue, isStreaming);

      expect(setDoubleCheckIfOffline).toHaveBeenCalledWith(false);
      expect(setStreamIsAlreadyOnline).toHaveBeenCalledWith(false);
      expect(setDoubleCheckIfOffline).toHaveBeenCalledTimes(1);
      expect(setStreamIsAlreadyOnline).toHaveBeenCalledTimes(1);
      expect(actionWhenDoubleCheckIsTrue).toHaveBeenCalled();
    }
  });
});
