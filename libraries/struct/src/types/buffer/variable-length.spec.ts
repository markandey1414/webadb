/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, it, jest } from "@jest/globals";

import {
    StructDefaultOptions,
    StructFieldValue,
    StructValue,
} from "../../basic/index.js";

import {
    BufferFieldConverter,
    EMPTY_UINT8_ARRAY,
    Uint8ArrayBufferFieldConverter,
} from "./base.js";
import {
    VariableLengthBufferLikeFieldDefinition,
    VariableLengthBufferLikeFieldLengthValue,
    VariableLengthBufferLikeStructFieldValue,
    type VariableLengthBufferLikeFieldOptions,
} from "./variable-length.js";

class MockLengthFieldValue extends StructFieldValue<any> {
    constructor() {
        super({} as any, {} as any, {} as any, {});
    }

    override value: string | number = 0;

    override get = jest.fn((): string | number => this.value);

    size = 0;

    override getSize = jest.fn((): number => this.size);

    override set = jest.fn((value: string | number) => {
        void value;
    });

    serialize = jest.fn(
        (dataView: DataView, array: Uint8Array, offset: number): void => {
            void dataView;
            void offset;
        },
    );
}

describe("Types", () => {
    describe("VariableLengthBufferLikeFieldLengthValue", () => {
        class MockBufferLikeFieldValue extends StructFieldValue<
            VariableLengthBufferLikeFieldDefinition<
                any,
                VariableLengthBufferLikeFieldOptions<any, any>,
                any
            >
        > {
            constructor() {
                super({ options: {} } as any, {} as any, {} as any, {});
            }

            size = 0;

            override getSize = jest.fn(() => this.size);

            serialize(
                dataView: DataView,
                array: Uint8Array,
                offset: number,
            ): void {
                void dataView;
                void array;
                void offset;
                throw new Error("Method not implemented.");
            }
        }

        describe("#getSize", () => {
            it("should return size of its original field value", () => {
                const mockOriginalFieldValue = new MockLengthFieldValue();
                const mockArrayBufferFieldValue =
                    new MockBufferLikeFieldValue();
                const lengthFieldValue =
                    new VariableLengthBufferLikeFieldLengthValue(
                        mockOriginalFieldValue,
                        mockArrayBufferFieldValue,
                    );

                mockOriginalFieldValue.size = 0;
                expect(lengthFieldValue.getSize()).toBe(0);
                expect(mockOriginalFieldValue.getSize).toHaveBeenCalledTimes(1);

                mockOriginalFieldValue.getSize.mockClear();
                mockOriginalFieldValue.size = 100;
                expect(lengthFieldValue.getSize()).toBe(100);
                expect(mockOriginalFieldValue.getSize).toHaveBeenCalledTimes(1);
            });
        });

        describe("#get", () => {
            it("should return size of its `arrayBufferField`", () => {
                const mockOriginalFieldValue = new MockLengthFieldValue();
                const mockArrayBufferFieldValue =
                    new MockBufferLikeFieldValue();
                const lengthFieldValue =
                    new VariableLengthBufferLikeFieldLengthValue(
                        mockOriginalFieldValue,
                        mockArrayBufferFieldValue,
                    );

                mockOriginalFieldValue.value = 0;
                mockArrayBufferFieldValue.size = 0;
                expect(lengthFieldValue.get()).toBe(0);
                expect(mockArrayBufferFieldValue.getSize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.get).toHaveBeenCalledTimes(1);

                mockArrayBufferFieldValue.getSize.mockClear();
                mockOriginalFieldValue.get.mockClear();
                mockArrayBufferFieldValue.size = 100;
                expect(lengthFieldValue.get()).toBe(100);
                expect(mockArrayBufferFieldValue.getSize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.get).toHaveBeenCalledTimes(1);
            });

            it("should return size of its `arrayBufferField` as string", () => {
                const mockOriginalFieldValue = new MockLengthFieldValue();
                const mockArrayBufferFieldValue =
                    new MockBufferLikeFieldValue();
                const lengthFieldValue =
                    new VariableLengthBufferLikeFieldLengthValue(
                        mockOriginalFieldValue,
                        mockArrayBufferFieldValue,
                    );

                mockOriginalFieldValue.value = "0";
                mockArrayBufferFieldValue.size = 0;
                expect(lengthFieldValue.get()).toBe("0");
                expect(mockArrayBufferFieldValue.getSize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.get).toHaveBeenCalledTimes(1);

                mockArrayBufferFieldValue.getSize.mockClear();
                mockOriginalFieldValue.get.mockClear();
                mockArrayBufferFieldValue.size = 100;
                expect(lengthFieldValue.get()).toBe("100");
                expect(mockArrayBufferFieldValue.getSize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.get).toHaveBeenCalledTimes(1);
            });
        });

        describe("#set", () => {
            it("should does nothing", () => {
                const mockOriginalFieldValue = new MockLengthFieldValue();
                const mockArrayBufferFieldValue =
                    new MockBufferLikeFieldValue();
                const lengthFieldValue =
                    new VariableLengthBufferLikeFieldLengthValue(
                        mockOriginalFieldValue,
                        mockArrayBufferFieldValue,
                    );

                mockOriginalFieldValue.value = 0;
                mockArrayBufferFieldValue.size = 0;
                expect(lengthFieldValue.get()).toBe(0);

                (lengthFieldValue as StructFieldValue<any>).set(100);
                expect(lengthFieldValue.get()).toBe(0);
            });
        });

        describe("#serialize", () => {
            it("should call `serialize` of its `originalField`", () => {
                const mockOriginalFieldValue = new MockLengthFieldValue();
                const mockArrayBufferFieldValue =
                    new MockBufferLikeFieldValue();
                const lengthFieldValue =
                    new VariableLengthBufferLikeFieldLengthValue(
                        mockOriginalFieldValue,
                        mockArrayBufferFieldValue,
                    );

                const dataView = 0 as any;
                const array = 2 as any;
                const offset = 1 as any;

                mockOriginalFieldValue.value = 10;
                mockArrayBufferFieldValue.size = 0;
                lengthFieldValue.serialize(dataView, array, offset);
                expect(mockOriginalFieldValue.get).toHaveBeenCalledTimes(1);
                expect(mockOriginalFieldValue.get).toHaveReturnedWith(10);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledTimes(1);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledWith(0);
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledWith(
                    dataView,
                    array,
                    offset,
                );

                mockOriginalFieldValue.set.mockClear();
                mockOriginalFieldValue.serialize.mockClear();
                mockArrayBufferFieldValue.size = 100;
                lengthFieldValue.serialize(dataView, array, offset);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledTimes(1);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledWith(100);
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledWith(
                    dataView,
                    array,
                    offset,
                );
            });

            it("should stringify its length if `originalField` is a string", () => {
                const mockOriginalFieldValue = new MockLengthFieldValue();
                const mockArrayBufferFieldValue =
                    new MockBufferLikeFieldValue();
                const lengthFieldValue =
                    new VariableLengthBufferLikeFieldLengthValue(
                        mockOriginalFieldValue,
                        mockArrayBufferFieldValue,
                    );

                const dataView = 0 as any;
                const array = 2 as any;
                const offset = 1 as any;

                mockOriginalFieldValue.value = "10";
                mockArrayBufferFieldValue.size = 0;
                lengthFieldValue.serialize(dataView, array, offset);
                expect(mockOriginalFieldValue.get).toHaveBeenCalledTimes(1);
                expect(mockOriginalFieldValue.get).toHaveReturnedWith("10");
                expect(mockOriginalFieldValue.set).toHaveBeenCalledTimes(1);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledWith("0");
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledWith(
                    dataView,
                    array,
                    offset,
                );

                mockOriginalFieldValue.set.mockClear();
                mockOriginalFieldValue.serialize.mockClear();
                mockArrayBufferFieldValue.size = 100;
                lengthFieldValue.serialize(dataView, array, offset);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledTimes(1);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledWith("100");
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledWith(
                    dataView,
                    array,
                    offset,
                );
            });

            it("should stringify its length in specified radix if `originalField` is a string", () => {
                const mockOriginalFieldValue = new MockLengthFieldValue();
                const mockArrayBufferFieldValue =
                    new MockBufferLikeFieldValue();
                const lengthFieldValue =
                    new VariableLengthBufferLikeFieldLengthValue(
                        mockOriginalFieldValue,
                        mockArrayBufferFieldValue,
                    );

                const radix = 16;
                mockArrayBufferFieldValue.definition.options.lengthFieldRadix =
                    radix;

                const dataView = 0 as any;
                const array = 2 as any;
                const offset = 1 as any;

                mockOriginalFieldValue.value = "10";
                mockArrayBufferFieldValue.size = 0;
                lengthFieldValue.serialize(dataView, array, offset);
                expect(mockOriginalFieldValue.get).toHaveBeenCalledTimes(1);
                expect(mockOriginalFieldValue.get).toHaveReturnedWith("10");
                expect(mockOriginalFieldValue.set).toHaveBeenCalledTimes(1);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledWith("0");
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledWith(
                    dataView,
                    array,
                    offset,
                );

                mockOriginalFieldValue.set.mockClear();
                mockOriginalFieldValue.serialize.mockClear();
                mockArrayBufferFieldValue.size = 100;
                lengthFieldValue.serialize(dataView, array, offset);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledTimes(1);
                expect(mockOriginalFieldValue.set).toHaveBeenCalledWith(
                    (100).toString(radix),
                );
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledTimes(
                    1,
                );
                expect(mockOriginalFieldValue.serialize).toHaveBeenCalledWith(
                    dataView,
                    array,
                    offset,
                );
            });
        });
    });

    describe("VariableLengthArrayBufferLikeStructFieldValue", () => {
        describe(".constructor", () => {
            it("should forward parameters", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const arrayBufferFieldDefinition =
                    new VariableLengthBufferLikeFieldDefinition(
                        Uint8ArrayBufferFieldConverter.Instance,
                        { lengthField },
                    );

                const value = EMPTY_UINT8_ARRAY;

                const bufferFieldValue =
                    new VariableLengthBufferLikeStructFieldValue(
                        arrayBufferFieldDefinition,
                        StructDefaultOptions,
                        struct,
                        value,
                    );

                expect(bufferFieldValue).toHaveProperty(
                    "definition",
                    arrayBufferFieldDefinition,
                );
                expect(bufferFieldValue).toHaveProperty(
                    "options",
                    StructDefaultOptions,
                );
                expect(bufferFieldValue).toHaveProperty("struct", struct);
                expect(bufferFieldValue).toHaveProperty("value", value);
                expect(bufferFieldValue).toHaveProperty("array", undefined);
                expect(bufferFieldValue).toHaveProperty("length", undefined);
            });

            it("should forward parameters with `arrayBuffer`", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const arrayBufferFieldDefinition =
                    new VariableLengthBufferLikeFieldDefinition(
                        Uint8ArrayBufferFieldConverter.Instance,
                        { lengthField },
                    );

                const value = new Uint8Array(100);

                const bufferFieldValue =
                    new VariableLengthBufferLikeStructFieldValue(
                        arrayBufferFieldDefinition,
                        StructDefaultOptions,
                        struct,
                        value,
                        value,
                    );

                expect(bufferFieldValue).toHaveProperty(
                    "definition",
                    arrayBufferFieldDefinition,
                );
                expect(bufferFieldValue).toHaveProperty(
                    "options",
                    StructDefaultOptions,
                );
                expect(bufferFieldValue).toHaveProperty("struct", struct);
                expect(bufferFieldValue).toHaveProperty("value", value);
                expect(bufferFieldValue).toHaveProperty("array", value);
                expect(bufferFieldValue).toHaveProperty("length", 100);
            });

            it("should replace `lengthField` on `struct`", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const arrayBufferFieldDefinition =
                    new VariableLengthBufferLikeFieldDefinition(
                        Uint8ArrayBufferFieldConverter.Instance,
                        { lengthField },
                    );

                const value = EMPTY_UINT8_ARRAY;

                const bufferFieldValue =
                    new VariableLengthBufferLikeStructFieldValue(
                        arrayBufferFieldDefinition,
                        StructDefaultOptions,
                        struct,
                        value,
                    );

                expect(bufferFieldValue["lengthFieldValue"]).toBeInstanceOf(
                    StructFieldValue,
                );
                expect(struct.fieldValues[lengthField]).toBe(
                    bufferFieldValue["lengthFieldValue"],
                );
            });
        });

        describe("#getSize", () => {
            class MockArrayBufferFieldType extends BufferFieldConverter<Uint8Array> {
                override toBuffer = jest.fn((value: Uint8Array): Uint8Array => {
                    return value;
                });

                override toValue = jest.fn(
                    (arrayBuffer: Uint8Array): Uint8Array => {
                        return arrayBuffer;
                    },
                );

                size: number | undefined = 0;

                override getSize = jest.fn(
                    (value: Uint8Array): number | undefined => {
                        void value;
                        return this.size;
                    },
                );
            }

            it("should return cached size if exist", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const arrayBufferFieldType = new MockArrayBufferFieldType();
                const arrayBufferFieldDefinition =
                    new VariableLengthBufferLikeFieldDefinition(
                        arrayBufferFieldType,
                        {
                            lengthField,
                        },
                    );

                const value = new Uint8Array(100);

                const bufferFieldValue =
                    new VariableLengthBufferLikeStructFieldValue(
                        arrayBufferFieldDefinition,
                        StructDefaultOptions,
                        struct,
                        value,
                        value,
                    );

                expect(bufferFieldValue.getSize()).toBe(100);
                expect(arrayBufferFieldType.toValue).toHaveBeenCalledTimes(0);
                expect(arrayBufferFieldType.toBuffer).toHaveBeenCalledTimes(0);
                expect(arrayBufferFieldType.getSize).toHaveBeenCalledTimes(0);
            });

            it("should call `getSize` of its `type`", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const arrayBufferFieldType = new MockArrayBufferFieldType();
                const arrayBufferFieldDefinition =
                    new VariableLengthBufferLikeFieldDefinition(
                        arrayBufferFieldType,
                        {
                            lengthField,
                        },
                    );

                const value = new Uint8Array(100);

                const bufferFieldValue =
                    new VariableLengthBufferLikeStructFieldValue(
                        arrayBufferFieldDefinition,
                        StructDefaultOptions,
                        struct,
                        value,
                    );

                arrayBufferFieldType.size = 100;
                expect(bufferFieldValue.getSize()).toBe(100);
                expect(arrayBufferFieldType.toValue).toHaveBeenCalledTimes(0);
                expect(arrayBufferFieldType.toBuffer).toHaveBeenCalledTimes(0);
                expect(arrayBufferFieldType.getSize).toHaveBeenCalledTimes(1);
                expect(bufferFieldValue).toHaveProperty("array", undefined);
                expect(bufferFieldValue).toHaveProperty("length", 100);
            });

            it("should call `toArrayBuffer` of its `type` if it does not support `getSize`", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const arrayBufferFieldType = new MockArrayBufferFieldType();
                const arrayBufferFieldDefinition =
                    new VariableLengthBufferLikeFieldDefinition(
                        arrayBufferFieldType,
                        {
                            lengthField,
                        },
                    );

                const value = new Uint8Array(100);

                const bufferFieldValue =
                    new VariableLengthBufferLikeStructFieldValue(
                        arrayBufferFieldDefinition,
                        StructDefaultOptions,
                        struct,
                        value,
                    );

                arrayBufferFieldType.size = undefined;
                expect(bufferFieldValue.getSize()).toBe(100);
                expect(arrayBufferFieldType.toValue).toHaveBeenCalledTimes(0);
                expect(arrayBufferFieldType.toBuffer).toHaveBeenCalledTimes(1);
                expect(arrayBufferFieldType.getSize).toHaveBeenCalledTimes(1);
                expect(bufferFieldValue).toHaveProperty("array", value);
                expect(bufferFieldValue).toHaveProperty("length", 100);
            });
        });

        describe("#set", () => {
            it("should call `ArrayBufferLikeFieldValue#set`", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const arrayBufferFieldDefinition =
                    new VariableLengthBufferLikeFieldDefinition(
                        Uint8ArrayBufferFieldConverter.Instance,
                        { lengthField },
                    );

                const value = new Uint8Array(100);

                const bufferFieldValue =
                    new VariableLengthBufferLikeStructFieldValue(
                        arrayBufferFieldDefinition,
                        StructDefaultOptions,
                        struct,
                        value,
                        value,
                    );

                const newValue = new ArrayBuffer(100);
                bufferFieldValue.set(newValue);
                expect(bufferFieldValue.get()).toBe(newValue);
                expect(bufferFieldValue).toHaveProperty("array", undefined);
            });

            it("should clear length", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const arrayBufferFieldDefinition =
                    new VariableLengthBufferLikeFieldDefinition(
                        Uint8ArrayBufferFieldConverter.Instance,
                        { lengthField },
                    );

                const value = new Uint8Array(100);

                const bufferFieldValue =
                    new VariableLengthBufferLikeStructFieldValue(
                        arrayBufferFieldDefinition,
                        StructDefaultOptions,
                        struct,
                        value,
                        value,
                    );

                const newValue = new ArrayBuffer(100);
                bufferFieldValue.set(newValue);
                expect(bufferFieldValue).toHaveProperty("length", undefined);
            });
        });
    });

    describe("VariableLengthArrayBufferLikeFieldDefinition", () => {
        describe("#getSize", () => {
            it("should always return `0`", () => {
                const definition = new VariableLengthBufferLikeFieldDefinition(
                    Uint8ArrayBufferFieldConverter.Instance,
                    { lengthField: "foo" },
                );
                expect(definition.getSize()).toBe(0);
            });
        });

        describe("#getDeserializeSize", () => {
            it("should return value of its `lengthField`", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const definition = new VariableLengthBufferLikeFieldDefinition(
                    Uint8ArrayBufferFieldConverter.Instance,
                    { lengthField },
                );

                originalLengthFieldValue.value = 0;
                expect(definition["getDeserializeSize"](struct)).toBe(0);
                expect(originalLengthFieldValue.get).toHaveBeenCalledTimes(1);

                originalLengthFieldValue.get.mockClear();
                originalLengthFieldValue.value = 100;
                expect(definition["getDeserializeSize"](struct)).toBe(100);
                expect(originalLengthFieldValue.get).toHaveBeenCalledTimes(1);
            });

            it("should return value of its `lengthField` as number", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const definition = new VariableLengthBufferLikeFieldDefinition(
                    Uint8ArrayBufferFieldConverter.Instance,
                    { lengthField },
                );

                originalLengthFieldValue.value = "0";
                expect(definition["getDeserializeSize"](struct)).toBe(0);
                expect(originalLengthFieldValue.get).toHaveBeenCalledTimes(1);

                originalLengthFieldValue.get.mockClear();
                originalLengthFieldValue.value = "100";
                expect(definition["getDeserializeSize"](struct)).toBe(100);
                expect(originalLengthFieldValue.get).toHaveBeenCalledTimes(1);
            });

            it("should return value of its `lengthField` as number with specified radix", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const radix = 8;
                const definition = new VariableLengthBufferLikeFieldDefinition(
                    Uint8ArrayBufferFieldConverter.Instance,
                    { lengthField, lengthFieldRadix: radix },
                );

                originalLengthFieldValue.value = "0";
                expect(definition["getDeserializeSize"](struct)).toBe(0);
                expect(originalLengthFieldValue.get).toHaveBeenCalledTimes(1);

                originalLengthFieldValue.get.mockClear();
                originalLengthFieldValue.value = "100";
                expect(definition["getDeserializeSize"](struct)).toBe(
                    Number.parseInt("100", radix),
                );
                expect(originalLengthFieldValue.get).toHaveBeenCalledTimes(1);
            });
        });

        describe("#create", () => {
            it("should create a `VariableLengthArrayBufferLikeFieldValue`", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const definition = new VariableLengthBufferLikeFieldDefinition(
                    Uint8ArrayBufferFieldConverter.Instance,
                    { lengthField },
                );

                const value = new Uint8Array(100);
                const bufferFieldValue = definition.create(
                    StructDefaultOptions,
                    struct,
                    value,
                );

                expect(bufferFieldValue).toHaveProperty(
                    "definition",
                    definition,
                );
                expect(bufferFieldValue).toHaveProperty(
                    "options",
                    StructDefaultOptions,
                );
                expect(bufferFieldValue).toHaveProperty("struct", struct);
                expect(bufferFieldValue).toHaveProperty("value", value);
                expect(bufferFieldValue).toHaveProperty("array", undefined);
                expect(bufferFieldValue).toHaveProperty("length", undefined);
            });

            it("should create a `VariableLengthArrayBufferLikeFieldValue` with `arrayBuffer`", () => {
                const struct = new StructValue({});

                const lengthField = "foo";
                const originalLengthFieldValue = new MockLengthFieldValue();
                struct.set(lengthField, originalLengthFieldValue);

                const definition = new VariableLengthBufferLikeFieldDefinition(
                    Uint8ArrayBufferFieldConverter.Instance,
                    { lengthField },
                );

                const value = new Uint8Array(100);
                const bufferFieldValue = definition.create(
                    StructDefaultOptions,
                    struct,
                    value,
                    value,
                );

                expect(bufferFieldValue).toHaveProperty(
                    "definition",
                    definition,
                );
                expect(bufferFieldValue).toHaveProperty(
                    "options",
                    StructDefaultOptions,
                );
                expect(bufferFieldValue).toHaveProperty("struct", struct);
                expect(bufferFieldValue).toHaveProperty("value", value);
                expect(bufferFieldValue).toHaveProperty("array", value);
                expect(bufferFieldValue).toHaveProperty("length", 100);
            });
        });
    });
});
