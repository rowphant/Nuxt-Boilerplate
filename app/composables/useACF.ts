import { useState } from "#app"; // Wichtig: useState aus Nuxt importieren

export const useACF = () => {
  const checkConditionalLogic = (formData, conditions) => {
    // Verwende 'some' um zu prüfen, ob irgendeine Bedingungsgruppe zutrifft
    return conditions.some((conditionGroup: any) => {
      // Verwende 'every' um zu prüfen, ob ALLE Bedingungen INNERHALB einer Gruppe zutreffen
      const groupComply = conditionGroup.every((condition: Condition) => {
        const fieldValue = formData[condition.field].value;
        let comply = false;

        switch (condition.operator) {
          case "!=empty":
            comply =
              fieldValue !== "" &&
              fieldValue !== null &&
              typeof fieldValue !== "undefined";
            break;
          case "==empty":
            comply =
              String(fieldValue) === "" ||
              String(fieldValue) === null ||
              typeof fieldValue === "undefined";
            break;
          case "==contains":
            comply = String(fieldValue).includes(String(condition.value));
            break;
          case "==":
            return String(fieldValue) === String(condition.value);
          case "!=":
            return String(fieldValue) !== String(condition.value);
          case ">":
            return Number(fieldValue) > Number(condition.value);
          case "<":
            return Number(fieldValue) < Number(condition.value);
          case ">=":
            return Number(fieldValue) >= Number(condition.value);
          case "<=":
            return Number(fieldValue) <= Number(condition.value);
          default:
            comply = false; // Standardfall
            break;
        }
        return comply;
      });

      return groupComply;
    });
  };

  return {
    checkConditionalLogic,
  };
};
