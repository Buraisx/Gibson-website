 function escapeHtml(texty) {
        var str =document.getElementById(texty);
        var replacer = str.value.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
          document.getElementById(texty).value = replacer;
    }