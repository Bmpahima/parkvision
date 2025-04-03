export const COLORS = {
    
    primary950: "#0F172A",
    primary900: "#022a99",   // Darkest blue
    primary800: "#0234b3",   // Even darker
    primary700: "#023fcc",   // Darker blue
    primary600: "#024ae6",   // Slightly darker
    primary500: "#0253ff",   // Base blue
    primary400: "#306aff",   // Slightly lighter
    primary300: "#5980ff",   // Lighter blue
    primary200: "#82a3ff",   // Softer blue
    primary100: "#abc7ff",   // Pastel blue
    primary50: "#d5e4ff",    // Lightest blue
 
    gray900: "#1a1a1a",      // Very dark gray
    gray800: "#333333",      // Dark gray
    gray700: "#4d4d4d",      // Medium dark gray
    gray600: "#666666",      // Medium gray
    gray500: "#808080",      // Neutral gray
    gray400: "#999999",      // Light gray
    gray300: "#b3b3b3",      // Lighter gray
    gray200: "#cccccc",      // Very light gray
    gray100: "#e5e5e5",      // Almost white
    gray50: "#ffffff",       // White

  };


  export const UI_COLORS = {
    red400: "#F44336", 
    red600: "#D32F2F",
    yellow400: "#FFC107",
    yellow600: "#FFA000",
    green400: "#4CAF50", 
    green600: "#388E3C",
  }

export const CAR_COLORS = {
  "ירוק מטל": "#008000",
  "כחול": "#0000FF",
  "כסף ירקרק": "#90EE90",
  "כסף ים": "#778899",
  "נחושת": "#B87333",
  "מנדרינה מט": "#FFA500",
  "ירוק בהיר": "#90EE90",
  "צהוב": "#FFFF00",
  "ירוק ים": "#8FBC8F",
  "אדום": "#FF0000",
  "נחושת מטאלי": "#B87333",
  "שחור חציל": "#222222",
  "אדום מטל": "#B22222",
  "כתום": "#FFA500",
  "כחול פנינה": "#ADD8E6",
  "כסף": "#C0C0C0",
  "בז כהה": "#B8860B",
  "שחור מטלי": "#2F4F4F",
  "אפור ברונזה": "#CD7F32",
  "חום": "#A52A2A",
  "חום בהיר": "#D2B48C",
  "כחול פחם מטלי": "#708090",
  "חום כהה": "#8B4513",
  "אדום שחור": "#8B0000",
  "טוניק": "#40E0D0",
  "כסוף כהה מטלי": "#A9A9A9",
  "זהוב": "#FFD700",
  "אפור מטל": "#808080",
  "ירוק זהב מטלי": "#9ACD32",
  "ירקרק": "#98FB98",
  "רוז מתכתי": "#FF69B4",
  "סהרה": "#C6AB80",
  "זהב מטאלי": "#FFD700",
  "חציל": "#800080",
  "כסף כחלחל מטלי": "#778899",
  "ורוד": "#FFC0CB",
  "ירוק כהה": "#006400",
  "ירקרק מטלי": "#98FB98",
  "כחול כהה": "#00008B",
  "זהב": "#FFD700",
  "כחול קריסטל": "#87CEEB",
  "אפור בהיר": "#D3D3D3",
  "אפור פלדה": "#708090",
  "זית מטאלי": "#8FBC8F",
  "צהוב מטאלי": "#FFD700",
  "אדום כהה (יין)": "#8B0000",
  "כסוף בהיר": "#D3D3D3",
  "צהוב חזק": "#FFFF00",
  "ירוק פנינה": "#98FB98",
  "אדום קלאסי": "#FF0000",
  "כחול בהיר": "#ADD8E6",
  "ירוק": "#008000",
  "כחול מטל": "#4682B4",
  "אפור כחול מטלי": "#778899",
  "צהוב לימון": "#FFFFE0",
  "חרדל": "#FFDB58",
  "בז": "#F5F5DC",
  "טורקיז מטאלי": "#40E0D0",
  "כסף מטלי": "#C0C0C0",
  "כסוף מילניום": "#808080",
  "אדום זוהר": "#FF0000",
  "ירוק זית מטלי": "#8FBC8F",
  "אפור בהיר מטלי": "#D3D3D3",
  "ירקרק בהיר": "#98FB98",
  "ירוק אקווה": "#00FFFF",
  "בז מטאלי": "#CDAA7D",
  "סגול": "#800080",
  "ירוק כסוף": "#8FBC8F",
  "אפור כהה": "#A9A9A9",
  "תכלת מטאלי": "#87CEEB",
  "כסוף כהה": "#A9A9A9",
  "תכלת": "#87CEEB",
  "פלטינה": "#E5E4E2",
  "קפה מטאלי": "#6F4E37",
  "ירוק זית": "#808000",
  "קרם": "#FFFDD0",
  "ברונזה": "#CD7F32",
  " לא ידוע": "#FFFFFF",
  "טורקיז": "#40E0D0",
  "רב גווני": "#FFFFFF",
  "בורדו": "#800020",
  "שנהב לבן": "#FFFFF0",
  "אפור": "#808080",
  "אפור כהה מטלי": "#A9A9A9",
  "שחור": "#000000",
  "סגול בהיר": "#E6E6FA",
  "כסף תכלת מטלי": "#A9A9BF",
  "סגול כהה": "#301934",
  "בורדו מטל": "#800020",
  "שחור פנינה": "#0E1413",
  "שן פיל": "#FFFFF0",
};


function getShortName (fname, lname) {
  let result = "";
  if (fname && fname.length > 0) { 
    result = result + fname[0]
  }
  if (lname && lname.length > 0) { 
    result = result + lname[0]
  }
  return result.toUpperCase();
}

export function fixReversedHebrew(text) {
  const reversed = text.split("").reverse().join("");
  return reversed;
}



  
export default getShortName;
  
  

  