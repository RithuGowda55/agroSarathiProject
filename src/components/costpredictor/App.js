import React, { useState, useEffect } from "react";
import "./App.css";
import Back from "../common/back/Back";

const ProductionCostCalculator = () => {
  const [inputs, setInputs] = useState({});
  const [outputs, setOutputs] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const floatValue = parseFloat(value) || 0;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: floatValue,
    }));
  };

  useEffect(() => {
    calculateOutputs();
  }, [inputs]); // Recalculate outputs whenever inputs change

  const calculateOutputs = () => {
    const i = inputs;

    const newOutputs = {
      // Labour Costs
      hiredMaleLabour: (i.maleDays || 0) * (i.maleRate || 0),
      hiredFemaleLabour: (i.femaleDays || 0) * (i.femaleRate || 0),
      bullockLabour: (i.bullockDays || 0) * (i.bullockRate || 0),

      // Machinery and Material Costs
      machineryCharges: (i.machineryHours || 0) * (i.machineryRate || 0),
      seedCost: (i.seedQuantity || 0) * (i.seedPrice || 0),
      manureCost: (i.manureQuantity || 0) * (i.manurePrice || 0),
      fertilizerCost:
        (i.ureaQty || 0) * (i.ureaPrice || 0) +
        (i.dapQty || 0) * (i.dapPrice || 0) +
        (i.mopQty || 0) * (i.mopPrice || 0) +
        (i.micronutrientCost || 0),

      // Operational Costs
      irrigationCharges: (i.irrigationUnits || 0) * (i.irrigationCost || 0),
      insecticidesCost: (i.insecticideQty || 0) * (i.insecticideCost || 0),
      landRevenue: i.landRevenueCost || 0,
      depreciation: (i.implementsCost || 0) * 0.1,
      miscCharges: i.miscChargesCost || 0,

      // Interest and Cost A
      interestWorkingCapital:
        0.06 *
        ((i.maleDays || 0) * (i.maleRate || 0) +
          (i.femaleDays || 0) * (i.femaleRate || 0) +
          (i.bullockDays || 0) * (i.bullockRate || 0) +
          (i.machineryHours || 0) * (i.machineryRate || 0) +
          (i.seedQuantity || 0) * (i.seedPrice || 0) +
          (i.manureQuantity || 0) * (i.manurePrice || 0) +
          (i.ureaQty || 0) * (i.ureaPrice || 0) +
          (i.dapQty || 0) * (i.dapPrice || 0) +
          (i.mopQty || 0) * (i.mopPrice || 0) +
          (i.micronutrientCost || 0) +
          (i.irrigationUnits || 0) * (i.irrigationCost || 0) +
          (i.insecticideQty || 0) * (i.insecticideCost || 0) +
          (i.landRevenueCost || 0) +
          (i.implementsCost || 0) * 0.1 +
          (i.miscChargesCost || 0)),

      costA:
        (i.maleDays || 0) * (i.maleRate || 0) +
        (i.femaleDays || 0) * (i.femaleRate || 0) +
        (i.bullockDays || 0) * (i.bullockRate || 0) +
        (i.machineryHours || 0) * (i.machineryRate || 0) +
        (i.seedQuantity || 0) * (i.seedPrice || 0) +
        (i.manureQuantity || 0) * (i.manurePrice || 0) +
        (i.ureaQty || 0) * (i.ureaPrice || 0) +
        (i.dapQty || 0) * (i.dapPrice || 0) +
        (i.mopQty || 0) * (i.mopPrice || 0) +
        (i.micronutrientCost || 0) +
        (i.irrigationUnits || 0) * (i.irrigationCost || 0) +
        (i.insecticideQty || 0) * (i.insecticideCost || 0) +
        (i.landRevenueCost || 0) +
        (i.implementsCost || 0) * 0.1 +
        (i.miscChargesCost || 0) +
        0.06 *
          ((i.maleDays || 0) * (i.maleRate || 0) +
            (i.femaleDays || 0) * (i.femaleRate || 0) +
            (i.bullockDays || 0) * (i.bullockRate || 0) +
            (i.machineryHours || 0) * (i.machineryRate || 0) +
            (i.seedQuantity || 0) * (i.seedPrice || 0) +
            (i.manureQuantity || 0) * (i.manurePrice || 0) +
            (i.ureaQty || 0) * (i.ureaPrice || 0) +
            (i.dapQty || 0) * (i.dapPrice || 0) +
            (i.mopQty || 0) * (i.mopPrice || 0) +
            (i.micronutrientCost || 0) +
            (i.irrigationUnits || 0) * (i.irrigationCost || 0) +
            (i.insecticideQty || 0) * (i.insecticideCost || 0) +
            (i.landRevenueCost || 0) +
            (i.implementsCost || 0) * 0.1 +
            (i.miscChargesCost || 0)),

      // Pricing Information for Yield
      valueMainProduct: (i.mainQty || 0) * (i.mainPrice || 0),
      valueByProduct: (i.byProductQty || 0) * (i.byProductPrice || 0),
      grossYield:
        (i.mainQty || 0) * (i.mainPrice || 0) +
        (i.byProductQty || 0) * (i.byProductPrice || 0),

      // Calculate rental value of land, interest on fixed capital, cost B, etc.
      rentalvalueofland:
        0.17 *
          ((i.mainQty || 0) * (i.mainPrice || 0) +
            (i.byProductQty || 0) * (i.byProductPrice || 0)) -
        (i.landRevenue || 0),
      InterestonFixedCapital:
        0.12 *
        (0.17 *
          ((i.mainQty || 0) * (i.mainPrice || 0) +
            (i.byProductQty || 0) * (i.byProductPrice || 0)) -
          (i.landRevenue || 0)),

      costB:
        (i.maleDays || 0) * (i.maleRate || 0) +
        (i.femaleDays || 0) * (i.femaleRate || 0) +
        (i.bullockDays || 0) * (i.bullockRate || 0) +
        (i.machineryHours || 0) * (i.machineryRate || 0) +
        (i.seedQuantity || 0) * (i.seedPrice || 0) +
        (i.manureQuantity || 0) * (i.manurePrice || 0) +
        (i.ureaQty || 0) * (i.ureaPrice || 0) +
        (i.dapQty || 0) * (i.dapPrice || 0) +
        (i.mopQty || 0) * (i.mopPrice || 0) +
        (i.micronutrientCost || 0) +
        (i.irrigationUnits || 0) * (i.irrigationCost || 0) +
        (i.insecticideQty || 0) * (i.insecticideCost || 0) +
        (i.landRevenueCost || 0) +
        (i.implementsCost || 0) * 0.1 +
        (i.miscChargesCost || 0) +
        0.06 *
          ((i.maleDays || 0) * (i.maleRate || 0) +
            (i.femaleDays || 0) * (i.femaleRate || 0) +
            (i.bullockDays || 0) * (i.bullockRate || 0) +
            (i.machineryHours || 0) * (i.machineryRate || 0) +
            (i.seedQuantity || 0) * (i.seedPrice || 0) +
            (i.manureQuantity || 0) * (i.manurePrice || 0) +
            (i.ureaQty || 0) * (i.ureaPrice || 0) +
            (i.dapQty || 0) * (i.dapPrice || 0) +
            (i.mopQty || 0) * (i.mopPrice || 0) +
            (i.micronutrientCost || 0) +
            (i.irrigationUnits || 0) * (i.irrigationCost || 0) +
            (i.insecticideQty || 0) * (i.insecticideCost || 0) +
            (i.landRevenueCost || 0) +
            (i.implementsCost || 0) * 0.1 +
            (i.miscChargesCost || 0)) +
        (0.17 *
          ((i.mainQty || 0) * (i.mainPrice || 0) +
            (i.byProductQty || 0) * (i.byProductPrice || 0)) -
          (i.landRevenue || 0)) +
        0.12 *
          (0.17 *
            ((i.mainQty || 0) * (i.mainPrice || 0) +
              (i.byProductQty || 0) * (i.byProductPrice || 0)) -
            (i.landRevenue || 0)),

      // Human Labor Calculations
      familyHumanLaborMale: (i.familyMaleDays || 0) * (i.familyMaleRate || 0),
      familyHumanLaborFemale:
        (i.familyFemaleDays || 0) * (i.familyFemaleRate || 0),

      // Supervisory Charges and Total Cost
      supervisoryCharges:
        0.1 * (((i.familyMaleDays || 0) * (i.familyMaleRate || 0))) + ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0)),
        totalCost:
        (
          // Cost A
          ((i.maleDays || 0) * (i.maleRate || 0)) +
          ((i.femaleDays || 0) * (i.femaleRate || 0)) +
          ((i.bullockDays || 0) * (i.bullockRate || 0)) +
          ((i.machineryHours || 0) * (i.machineryRate || 0)) +
          ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
          ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
          ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
          ((i.dapQty || 0) * (i.dapPrice || 0)) +
          ((i.mopQty || 0) * (i.mopPrice || 0)) +
          (i.micronutrientCost || 0) +
          ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
          ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
          (i.landRevenueCost || 0) +
          ((i.implementsCost || 0) * 0.1) +
          (i.miscChargesCost || 0) +
          0.06 *
            (
              ((i.maleDays || 0) * (i.maleRate || 0)) +
              ((i.femaleDays || 0) * (i.femaleRate || 0)) +
              ((i.bullockDays || 0) * (i.bullockRate || 0)) +
              ((i.machineryHours || 0) * (i.machineryRate || 0)) +
              ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
              ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
              ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
              ((i.dapQty || 0) * (i.dapPrice || 0)) +
              ((i.mopQty || 0) * (i.mopPrice || 0)) +
              (i.micronutrientCost || 0) +
              ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
              ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
              (i.landRevenueCost || 0) +
              ((i.implementsCost || 0) * 0.1) +
              (i.miscChargesCost || 0)
            )
        ) +
        (
          // Rental Value of Land
          (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
                   ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
          (i.landRevenue || 0)
        ) +
        (
          // Interest on Fixed Capital
          0.12 *
          (
            (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
                     ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
            (i.landRevenue || 0)
          )
        ) +
        (
          // Family Human Labor Male
          ((i.familyMaleDays || 0) * (i.familyMaleRate || 0))
        ) +
        (
          // Family Human Labor Female
          ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
        ) +
        (
          // Supervisory Charges
          0.1 *
          (
            ((i.familyMaleDays || 0) * (i.familyMaleRate || 0)) +
            ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
          )
        ),
      

      // Ratios and Profit
      BCRATIO: 
  (
    // Gross Yield: Value of main and by-products
    ((i.mainQty || 0) * (i.mainPrice || 0)) +
    ((i.byProductQty || 0) * (i.byProductPrice || 0))
  ) / 
  (
    // Total Cost
    (
      // Cost A
      ((i.maleDays || 0) * (i.maleRate || 0)) +
      ((i.femaleDays || 0) * (i.femaleRate || 0)) +
      ((i.bullockDays || 0) * (i.bullockRate || 0)) +
      ((i.machineryHours || 0) * (i.machineryRate || 0)) +
      ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
      ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
      ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
      ((i.dapQty || 0) * (i.dapPrice || 0)) +
      ((i.mopQty || 0) * (i.mopPrice || 0)) +
      (i.micronutrientCost || 0) +
      ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
      ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
      (i.landRevenueCost || 0) +
      ((i.implementsCost || 0) * 0.1) +
      (i.miscChargesCost || 0) +
      0.06 *
        (
          ((i.maleDays || 0) * (i.maleRate || 0)) +
          ((i.femaleDays || 0) * (i.femaleRate || 0)) +
          ((i.bullockDays || 0) * (i.bullockRate || 0)) +
          ((i.machineryHours || 0) * (i.machineryRate || 0)) +
          ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
          ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
          ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
          ((i.dapQty || 0) * (i.dapPrice || 0)) +
          ((i.mopQty || 0) * (i.mopPrice || 0)) +
          (i.micronutrientCost || 0) +
          ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
          ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
          (i.landRevenueCost || 0) +
          ((i.implementsCost || 0) * 0.1) +
          (i.miscChargesCost || 0)
        )
    ) +
    (
      // Rental Value of Land
      (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
               ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
      (i.landRevenue || 0)
    ) +
    (
      // Interest on Fixed Capital
      0.12 *
      (
        (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
                 ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
        (i.landRevenue || 0)
      )
    ) +
    (
      // Family Human Labor Male
      ((i.familyMaleDays || 0) * (i.familyMaleRate || 0))
    ) +
    (
      // Family Human Labor Female
      ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
    ) +
    (
      // Supervisory Charges
      0.1 *
      (
        ((i.familyMaleDays || 0) * (i.familyMaleRate || 0)) +
        ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
      )
    )
  || 1), // Avoid division by zero by defaulting denominator to 1

  netProfit: 
  (
    // Gross Yield: Value of main and by-products
    ((i.mainQty || 0) * (i.mainPrice || 0)) +
    ((i.byProductQty || 0) * (i.byProductPrice || 0))
  ) - 
  (
    // Total Cost (referencing expanded Total Cost formula)
    (
      // Cost A
      ((i.maleDays || 0) * (i.maleRate || 0)) +
      ((i.femaleDays || 0) * (i.femaleRate || 0)) +
      ((i.bullockDays || 0) * (i.bullockRate || 0)) +
      ((i.machineryHours || 0) * (i.machineryRate || 0)) +
      ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
      ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
      ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
      ((i.dapQty || 0) * (i.dapPrice || 0)) +
      ((i.mopQty || 0) * (i.mopPrice || 0)) +
      (i.micronutrientCost || 0) +
      ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
      ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
      (i.landRevenueCost || 0) +
      ((i.implementsCost || 0) * 0.1) +
      (i.miscChargesCost || 0) +
      0.06 *
        (
          ((i.maleDays || 0) * (i.maleRate || 0)) +
          ((i.femaleDays || 0) * (i.femaleRate || 0)) +
          ((i.bullockDays || 0) * (i.bullockRate || 0)) +
          ((i.machineryHours || 0) * (i.machineryRate || 0)) +
          ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
          ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
          ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
          ((i.dapQty || 0) * (i.dapPrice || 0)) +
          ((i.mopQty || 0) * (i.mopPrice || 0)) +
          (i.micronutrientCost || 0) +
          ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
          ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
          (i.landRevenueCost || 0) +
          ((i.implementsCost || 0) * 0.1) +
          (i.miscChargesCost || 0)
        )
    ) +
    (
      // Rental Value of Land
      (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
               ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
      (i.landRevenue || 0)
    ) +
    (
      // Interest on Fixed Capital
      0.12 *
      (
        (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
                 ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
        (i.landRevenue || 0)
      )
    ) +
    (
      // Family Human Labor Male
      ((i.familyMaleDays || 0) * (i.familyMaleRate || 0))
    ) +
    (
      // Family Human Labor Female
      ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
    ) +
    (
      // Supervisory Charges
      0.1 *
      (
        ((i.familyMaleDays || 0) * (i.familyMaleRate || 0)) +
        ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
      )
    )
  ),

      costPerQuintal: 
      (
        // Cost A
        ((i.maleDays || 0) * (i.maleRate || 0)) +
        ((i.femaleDays || 0) * (i.femaleRate || 0)) +
        ((i.bullockDays || 0) * (i.bullockRate || 0)) +
        ((i.machineryHours || 0) * (i.machineryRate || 0)) +
        ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
        ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
        ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
        ((i.dapQty || 0) * (i.dapPrice || 0)) +
        ((i.mopQty || 0) * (i.mopPrice || 0)) +
        (i.micronutrientCost || 0) +
        ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
        ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
        (i.landRevenueCost || 0) +
        ((i.implementsCost || 0) * 0.1) +
        (i.miscChargesCost || 0) +
        0.06 *
          (
            ((i.maleDays || 0) * (i.maleRate || 0)) +
            ((i.femaleDays || 0) * (i.femaleRate || 0)) +
            ((i.bullockDays || 0) * (i.bullockRate || 0)) +
            ((i.machineryHours || 0) * (i.machineryRate || 0)) +
            ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
            ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
            ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
            ((i.dapQty || 0) * (i.dapPrice || 0)) +
            ((i.mopQty || 0) * (i.mopPrice || 0)) +
            (i.micronutrientCost || 0) +
            ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
            ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
            (i.landRevenueCost || 0) +
            ((i.implementsCost || 0) * 0.1) +
            (i.miscChargesCost || 0)
          )
      ) +
      (
        // Rental Value of Land
        (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
                 ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
        (i.landRevenue || 0)
      ) +
      (
        // Interest on Fixed Capital
        0.12 *
        (
          (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
                   ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
          (i.landRevenue || 0)
        )
      ) +
      (
        // Family Human Labor Male
        ((i.familyMaleDays || 0) * (i.familyMaleRate || 0))
      ) +
      (
        // Family Human Labor Female
        ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
      ) +
      (
        // Supervisory Charges
        0.1 *
        (
          ((i.familyMaleDays || 0) * (i.familyMaleRate || 0)) +
          ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
        )
      )    /  (
        // Gross Yield: Value of main and by-products
        ((i.mainQty || 0) * (i.mainPrice || 0)) +
        ((i.byProductQty || 0) * (i.byProductPrice || 0)) || 1 // Avoid division by 0
      ),

      totalHector: i.hector || 0,
      finalAns: (
        // Cost A
        ((i.maleDays || 0) * (i.maleRate || 0)) +
        ((i.femaleDays || 0) * (i.femaleRate || 0)) +
        ((i.bullockDays || 0) * (i.bullockRate || 0)) +
        ((i.machineryHours || 0) * (i.machineryRate || 0)) +
        ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
        ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
        ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
        ((i.dapQty || 0) * (i.dapPrice || 0)) +
        ((i.mopQty || 0) * (i.mopPrice || 0)) +
        (i.micronutrientCost || 0) +
        ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
        ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
        (i.landRevenueCost || 0) +
        ((i.implementsCost || 0) * 0.1) +
        (i.miscChargesCost || 0) +
        0.06 *
          (
            ((i.maleDays || 0) * (i.maleRate || 0)) +
            ((i.femaleDays || 0) * (i.femaleRate || 0)) +
            ((i.bullockDays || 0) * (i.bullockRate || 0)) +
            ((i.machineryHours || 0) * (i.machineryRate || 0)) +
            ((i.seedQuantity || 0) * (i.seedPrice || 0)) +
            ((i.manureQuantity || 0) * (i.manurePrice || 0)) +
            ((i.ureaQty || 0) * (i.ureaPrice || 0)) +
            ((i.dapQty || 0) * (i.dapPrice || 0)) +
            ((i.mopQty || 0) * (i.mopPrice || 0)) +
            (i.micronutrientCost || 0) +
            ((i.irrigationUnits || 0) * (i.irrigationCost || 0)) +
            ((i.insecticideQty || 0) * (i.insecticideCost || 0)) +
            (i.landRevenueCost || 0) +
            ((i.implementsCost || 0) * 0.1) +
            (i.miscChargesCost || 0)
          )
      ) +
      (
        // Rental Value of Land
        (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
                 ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
        (i.landRevenue || 0)
      ) +
      (
        // Interest on Fixed Capital
        0.12 *
        (
          (0.17 * (((i.mainQty || 0) * (i.mainPrice || 0)) +
                   ((i.byProductQty || 0) * (i.byProductPrice || 0)))) -
          (i.landRevenue || 0)
        )
      ) +
      (
        // Family Human Labor Male
        ((i.familyMaleDays || 0) * (i.familyMaleRate || 0))
      ) +
      (
        // Family Human Labor Female
        ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
      ) +
      (
        // Supervisory Charges
        0.1 *
        (
          ((i.familyMaleDays || 0) * (i.familyMaleRate || 0)) +
          ((i.familyFemaleDays || 0) * (i.familyFemaleRate || 0))
        )
      )    /  (
        // Gross Yield: Value of main and by-products
        ((i.mainQty || 0) * (i.mainPrice || 0)) +
        ((i.byProductQty || 0) * (i.byProductPrice || 0)) || 1 // Avoid division by 0
      ) * (i.totalHector || 0) * 2.5,
    };

    setOutputs(newOutputs);
  };
  return (
    <>
    <Back title='Production Cost Calculator' />  
<div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >    
    {/* <h1>Production Cost Calculator</h1> */}
      <div style={{ display: "flex", gap: "40px" }}>
        {/* Input Section */}
        <div style={{ flex: 1 }}>
        <h2 style={{
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: 'bold',
  background: 'linear-gradient(to right, #6a11cb, #2575fc)', // Gradient color
  color: 'white',
  padding: '10px 20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
  textTransform: 'uppercase',
}}>
  Input Data
</h2>

          <form >
          <div
  style={{
    fontSize: "20px",
    margin:"px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
    textAlign: "center",
    padding: "10px 20px", // Add padding for space inside the div
    backgroundColor: "#f4f4f4", // Light background color
    border: "2px solid #ccc", // Add a border around the div
    borderRadius: "8px", // Rounded corners
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    maxWidth: "300px", // Limit the width
    margin: "30px auto", // Center the div horizontally
  }}
>
  Labour Costs
</div>


            <div>
              <label>Male Labor Days: </label>
              <input
                type="number"
                name="maleDays"
                value={inputs.maleDays || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Male Labor Rate: </label>
              <input
                type="number"
                name="maleRate"
                value={inputs.maleRate || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Female Labor Days: </label>
              <input
                type="number"
                name="femaleDays"
                value={inputs.femaleDays || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Female Labor Rate: </label>
              <input
                type="number"
                name="femaleRate"
                value={inputs.femaleRate || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Bullock Labor Days: </label>
              <input
                type="number"
                name="bullockDays"
                value={inputs.bullockDays || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Bullock Labor Rate: </label>
              <input
                type="number"
                name="bullockRate"
                value={inputs.bullockRate || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />

            </div>
            <div
              style={{
                fontSize: "20px",
                margin:"px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "10px",
                textAlign: "center",
                padding: "10px 20px", // Add padding for space inside the div
                backgroundColor: "#f4f4f4", // Light background color
                border: "2px solid #ccc", // Add a border around the div
                borderRadius: "8px", // Rounded corners
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                maxWidth: "300px", // Limit the width
                margin: "30px auto", // Center the div horizontally
              }}
            >
              Machinery and Material Costs
            </div>

            <div>
              <label>Machinery Hours: </label>
              <input
                type="number"
                name="machineryHours"
                value={inputs.machineryHours || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Machinery Rate: </label>
              <input
                type="number"
                name="machineryRate"
                value={inputs.machineryRate || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Seed Quantity: </label>
              <input
                type="number"
                name="seedQuantity"
                value={inputs.seedQuantity || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Seed Price: </label>
              <input
                type="number"
                name="seedPrice"
                value={inputs.seedPrice || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Manure Quantity: </label>
              <input
                type="number"
                name="manureQuantity"
                value={inputs.manureQuantity || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label>Manure Price: </label>
              <input
                type="number"
                name="manurePrice"
                value={inputs.manurePrice || ""}
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div
              style={{
                fontSize: "20px",
                margin:"px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "10px",
                textAlign: "center",
                padding: "10px 20px", // Add padding for space inside the div
                backgroundColor: "#f4f4f4", // Light background color
                border: "2px solid #ccc", // Add a border around the div
                borderRadius: "8px", // Rounded corners
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                maxWidth: "300px", // Limit the width
                margin: "30px auto", // Center the div horizontally
              }}
            >
              Other Operational Costs
            </div>

            {/* Fertilizer Inputs */}
            <label>
              Urea Quantity (kg):
              <input
                type="number"
                name="ureaQty"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Urea Price (per kg):
              <input
                type="number"
                name="ureaPrice"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              DAP Quantity (kg):
              <input
                type="number"
                name="dapQty"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              DAP Price (per kg):
              <input
                type="number"
                name="dapPrice"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              MOP Quantity (kg):
              <input
                type="number"
                name="mopQty"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              MOP Price (per kg):
              <input
                type="number"
                name="mopPrice"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Micronutrient Cost:
              <input
                type="number"
                name="micronutrientCost"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Irrigation Units:
              <input
                type="number"
                name="irrigationUnits"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Irrigation Cost (per unit):
              <input
                type="number"
                name="irrigationCost"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Insecticide Quantity:
              <input
                type="number"
                name="insecticideQty"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Insecticide Cost (per unit):
              <input
                type="number"
                name="insecticideCost"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Land Revenue Cost:
              <input
                type="number"
                name="landRevenueCost"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Implements Cost (for Depreciation):
              <input
                type="number"
                name="implementsCost"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />

            {/* Miscellaneous Charges Input */}
            <label>
              Miscellaneous Charges Cost:
              <input
                type="number"
                name="miscChargesCost"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              {/* </label>
            <div>
              <label>Interest on Working Capital: </label>
              <input
                type="number"
                name="interestWorkingCapital"
                value={inputs.interestWorkingCapital || ""}
                onChange={handleInputChange}
              />
            </div>
            <label> */}
              <div
                style={{
                  fontSize: "20px",
                  margin:"px",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "10px",
                  textAlign: "center",
                  padding: "10px 20px", // Add padding for space inside the div
                  backgroundColor: "#f4f4f4", // Light background color
                  border: "2px solid #ccc", // Add a border around the div
                  borderRadius: "8px", // Rounded corners
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                  maxWidth: "300px", // Limit the width
                  margin: "30px auto", // Center the div horizontally
                }}
              >
                Pricing Information for Yield
              </div>
              <div>
                <label>
                  Main Product Quantity:
                  <input
                    type="number"
                    name="mainQty"
                    onChange={handleInputChange}
                    style={{
                      margin: "5px",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </label>
                <br />
                <label>
                  Main Product Price:
                  <input
                    type="number"
                    name="mainPrice"
                    onChange={handleInputChange}
                    style={{
                      margin: "5px",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </label>
                <br />

                {/* By-Product Inputs */}
                <label>
                  By-Product Quantity:
                  <input
                    type="number"
                    name="byProductQty"
                    onChange={handleInputChange}
                    style={{
                      margin: "5px",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </label>
                <br />
                <label>
                  By-Product Price:
                  <input
                    type="number"
                    name="byProductPrice"
                    onChange={handleInputChange}
                    style={{
                      margin: "5px",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </label>
              </div>
              <div
                style={{
                  fontSize: "20px",
                  margin:"px",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "10px",
                  textAlign: "center",
                  padding: "10px 20px", // Add padding for space inside the div
                  backgroundColor: "#f4f4f4", // Light background color
                  border: "2px solid #ccc", // Add a border around the div
                  borderRadius: "8px", // Rounded corners
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                  maxWidth: "300px", // Limit the width
                  margin: "30px auto", // Center the div horizontally
                }}
              >
                Family Labour
              </div>
              Family Male Days:
              <input
                type="number"
                name="familyMaleDays"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Family Male Rate:
              <input
                type="number"
                name="familyMaleRate"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Family Female Days:
              <input
                type="number"
                name="familyFemaleDays"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Family Female Rate:
              <input
                type="number"
                name="familyFemaleRate"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <br />
            <label>
              Total Hector:
              <input
                type="number"
                name="hector"
                onChange={handleInputChange}
                style={{
                  margin: "5px",
                  padding: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
          </form>
        </div>

        {/* Output Section */}
        <div style={{ flex: 1 }} className="output-section">
        <h2 style={{
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: 'bold',
  background: 'linear-gradient(to right, #6a11cb, #2575fc)', // Gradient color
  color: 'white',
  padding: '10px 20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
  textTransform: 'uppercase',
}}>
  OUTPUT DATA
</h2>

<div className="output-container">
      <h2 className="output-title">Output Data</h2>
      
      <div className="output-card">
        {/* <p className="output-label">
          <strong>Cost per Quintal: {outputs.costPerQuintal || 0}</strong>
        </p> */}
        <p className="output-label">
          <strong>Labor Cost (Male): {outputs.hiredMaleLabour || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Labor Cost (Female): {outputs.hiredFemaleLabour || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Labor Cost (Bullock): {outputs.bullockLabour || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Machinery Charges: {outputs.machineryCharges || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Seed Cost: {outputs.seedCost || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Manure Cost: {outputs.manureCost || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Fertilizer Cost: {outputs.fertilizerCost || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Irrigation Charges: {outputs.irrigationCharges || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Insecticide Cost: {outputs.insecticidesCost || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Land Revenue: {outputs.landRevenue || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Depreciation: {outputs.depreciation || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Miscellaneous Charges: {outputs.miscCharges || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Interest on Working Capital: {outputs.interestWorkingCapital || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Cost A: {outputs.costA || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Value of Main Product: {outputs.valueMainProduct || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Value of By-Product: {outputs.valueByProduct || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Gross Yield: {outputs.grossYield || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Rental Value of Land: {outputs.rentalvalueofland || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Interest on Fixed Capital: {outputs.InterestonFixedCapital || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Cost B: {outputs.costB || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Family Human Labor (Male): {outputs.familyHumanLaborMale || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Family Human Labor (Female): {outputs.familyHumanLaborFemale || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Supervisory Charges: {outputs.supervisoryCharges || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Total Cost: {outputs.totalCost || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Benefit-Cost Ratio (BCR): {outputs.BCRATIO || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Net Profit: {outputs.netProfit || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Cost per Quintal: {outputs.costPerQuintal || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Total Hector: {outputs.totalHector || 0}</strong>
        </p>
        <p className="output-label">
          <strong>Final Answer: {outputs.finalAns || 0}</strong>
        </p>
      </div>
    </div>       
     </div>
      </div>
    </div>
    <br /><br /><br /><br /><br /><br />
    </>
  );
};

export default ProductionCostCalculator;
