export const PRODUCT_TITLE_MIN_LENGTH = 5;
export const PRODUCT_TITLE_MAX_LENGTH = 250;

export const PRODUCT_DESCRIPTION_MIN_LENGTH = 20;
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 1024;

export const PRODUCT_SKU_MIN_LENGTH = 3;
export const PRODUCT_SKU_MAX_LENGTH = 60;

export const PRODUCT_BRAND_NAME_MIN_LENGTH = 3;
export const PRODUCT_BRAND_NAME_MAX_LENGTH = 60;

export const PRODUCT_BULLET_POINT_MIN_LENGTH = 3;
export const PRODUCT_BULLET_POINT_MAX_LENGTH = 255;

export const PRODUCTS_MAX_IMAGES_COUNT = 10
export const PRODUCTS_MIN_IMAGES_COUNT = 1
export const PRODUCTS_IMAGE_MAX_SIZE_BYTES = 1024 * 1024 * 2
export const PRODUCTS_IMAGE_ACCEPTED_TYPES = ['image/png', 'image/webp', 'image/jpeg', 'image/jpg']

export const PRODUCT_MINIMUM_INVENTORY_QUANTITY = 1
export enum PRODUCT_OFFERING_CONDITION { New = "new", Used = "used" }
export enum PRODUCT_FULFILLMENT_TYPE { Megacommerce = "megacommerce", Supplier = "supplier" }

export const PRODUCT_OFFERING_CONDITION_NOTE_MIN_LENGTH = 5
export const PRODUCT_OFFERING_CONDITION_NOTE_MAX_LENGTH = 255
export const PRODUCT_MINIMUM_ORDER_MAX_OPTIONS = 4

export const PRODUCT_VARIATION_TITLE_MIN_LENGTH = 3
export const PRODUCT_VARIATION_TITLE_MAX_LENGTH = 32

export const PRODUCT_BATTERIES_NOTE_MIN_LENGTH = 5
export const PRODUCT_BATTERIES_NOTE_MAX_LENGTH = 255

// For the "Is this a Children's Product?" radio buttons
export const PRODUCT_IS_CHILDREN_PRODUCT_OPTIONS = {
  Yes: "yes",
  No: "no",
} as const;

export const PRODUCT_SAVING_TEMPERATURE_OPTIONS = {
  RoomTemperature: "room_temperature",
  Refrigerated: "refrigerated",
  Frozen: "frozen",
  DeepFrozen: "deep_frozen",
  ColdStorage: "cold_storage",
  ControlledTemperature: "controlled_temperature",
  NotApplicable: "not_applicable",
} as const;

export const PRODUCT_TARGET_AGE_GRADE_OPTIONS = {
  ZeroToThreeMonths: "0_to_3_months",
  ThreeToSixMonths: "3_to_6_months",
  SixToTwelveMonths: "6_to_12_months",
  OneToTwoYears: "12_to_24_months",
  TwoToThreeYears: "2_to_3_years",
  ThreeToFiveYears: "3_to_5_years",
  FiveToSevenYears: "5_to_7_years",
  EightToTenYears: "8_to_10_years",
  AllAges: 'all_ages'
} as const;

export const PRODUCT_COUNTRY_OF_ORIGIN_OPTIONS = {
  China: "CN",
  USA: "US",
  Germany: "DE",
  Vietnam: "VN",
} as const;

// For the "Does the product contain batteries?" radio buttons
export const PRODUCT_CONTAINS_BATTERIES_OPTIONS = {
  Yes: "yes",
  No: "no",
} as const;

// For the "Does the product contain hazardous materials?" radio buttons
export const PRODUCT_CONTAINS_HAZARDOUS_MATERIALS_OPTIONS = {
  Yes: "yes",
  No: "no",
} as const;

// For the "Potential Choking Hazards" checkbox group
export const PRODUCT_POTENTIAL_CHOKING_HAZARDS_OPTIONS = {
  SmallParts: "small_parts",
  Balls: "balls",
  Marbles: "marbles",
  SmallMagnets: "small_magnets",
  NotApplicable: "not_applicable",
} as const;

// For the "Potential Strangulation Hazards" checkbox group
export const PRODUCT_POTENTIAL_STRANGULATION_HAZARDS_OPTIONS = {
  LongCordsStrings: "long_cords_strings", // Simplified from "Cords/Strings longer than 12""
  Necklaces: "necklaces",
  NotApplicable: "not_applicable",
} as const;

// For the "Potential Sharp Points/Edges" checkbox group
export const PRODUCT_POTENTIAL_SHARP_POINTS_EDGES_OPTIONS = {
  FunctionalSharpPoints: "functional_sharp_points",
  NonFunctionalSharpEdges: "non_functional_sharp_edges",
  NotApplicable: "not_applicable",
} as const;

// For the "Flammability Classification" dropdown
export const PRODUCT_FLAMMABILITY_CLASSIFICATION_OPTIONS = {
  NotApplicable: "not_applicable",
  Class1: "class_1",
  Class2: "class_2",
  // ... other classes
} as const;

// For the "Allergen Information" checkbox group
export const PRODUCT_ALLERGEN_INFORMATION_OPTIONS = {
  ContainsNuts: "contains_nuts",
  ContainsLatex: "contains_latex",
  DairyFree: "dairy_free",
  Hypoallergenic: "hypoallergenic",
  NoneOfTheAbove: "none_of_the_above",
} as const;

// For the "Do you have a Children's Product Certificate (CPC)?" radio buttons
export const PRODUCT_HAS_CPC_OPTIONS = {
  Yes: "yes",
  No: "no",
} as const;

// For the "Applicable Safety Standards Met" multi-select
export const PRODUCT_APPLICABLE_SAFETY_STANDARDS_OPTIONS = {
  ASTM_F963_17: "astm_f963_17", // Toys
  CPSC_16_CFR_1500: "cpsc_16_cfr_1500", // Hazardous Substances
  CPSC_16_CFR_1501: "cpsc_16_cfr_1501", // Small Parts
  FCC_Part_15: "fcc_part_15", // Electronics
  UL_1642: "ul_1642", // Batteries
  // ... many other standards
} as const;

// For the "Prop 65 Compliance" radio buttons
export const PRODUCT_PROP_65_COMPLIANCE_OPTIONS = {
  DoesNotContain: "does_not_contain",
  ContainsWithWarning: "contains_with_warning",
} as const;

// For the "CE Marking (for EU)" radio buttons
export const PRODUCT_CE_MARKING_OPTIONS = {
  Yes: "yes",
  No: "no",
} as const;
