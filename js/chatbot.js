function toggleChat() {
    const chatbox = document.getElementById('chatbox-wrapper');
    chatbox.style.display = chatbox.style.display === 'none' ? 'block' : 'none';
  }

  function sendMessage() {
    const input = document.getElementById('userInput');
    const chatbox = document.getElementById('chatbox');
    const userMessage = input.value.trim();
    if (userMessage === '') return;

    addMessage('user', userMessage);

  
    const botReply = getBotReply(userMessage.toLowerCase());
    setTimeout(() => {
      addMessage('bot', botReply);
    }, 500);


    input.value = '';
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  function addMessage(sender, message) {
    const chatbox = document.getElementById('chatbox');
    const msgDiv = document.createElement('div');
    msgDiv.className = sender;
    msgDiv.textContent = message;
    chatbox.appendChild(msgDiv);
  }

  function getBotReply(message) {
      if(message.includes("اهلا"))
      {
          return "مرحبا! كيف يمكنني مساعدتك اليوم؟";
      }
        else if(message.includes("اريد التواصل بالدعم الفني")|| message.includes("الدعم "))
        {
            return "بالطبع! يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف. كيف يمكنني مساعدتك؟";
        }
        else if(message.includes("ما هو البريد الالكتروني")|| message.includes("البريد الالكتروني"))
        {
            return "البريد الإلكتروني الخاص بنا هو:  Yb3b@example.com";
        }
        else if(message.includes("ما هو رقم الهاتف")|| message.includes("رقم الهاتف"))
        {
            return "رقم الهاتف الخاص بنا هو: 123-456-7890";
        }
      else if(message.includes("كيف حالك"))
      {
          return "أنا بخير، شكرًا لك! كيف يمكنني مساعدتك؟";
      }
        else if(message.includes("ما الجديد"))
      {
            return "لدينا العديد من المنتجات الجديدة! هل تبحث عن شيء معين؟";
          
      }
        else if(message.includes("ما هي خدماتكم"))
        {
            return "نقدم خدمات متنوعة. هل تبحث عن شيء محدد؟";
        }
        else if(message.includes("ما هي مواعيد العمل"))
        {
            return "نحن نعمل من الأحد إلى الخميس، من 9 صباحًا إلى 5 مساءً.";
        }
        else if(message.includes("ما هي سياسة الارجاع"))
        {
            return "يمكنك إرجاع المنتجات خلال 30 يومًا من الشراء.";
        }
        else if(message.includes("ما هي طرق الدفع"))
        {
            return "نقبل الدفع نقدًا أو عبر بطاقات الائتمان.";
        }
        else if(message.includes("ما هي ساعات العمل"))
        {
            return "نحن متاحون من 9 صباحًا إلى 5 مساءً.";
        }
        else if(message.includes("ما هي العروض الحالية"))
        {
            return "لدينا عروض رائعة على مجموعة من المنتجات. تحقق منها في قسم العروض.";
        }
        else if(message.includes("ما هي طرق الشحن"))
        {
            return "نقدم خيارات شحن متعددة. هل لديك تفضيل معين؟";
        }
        else if(message.includes("ما هي سياسة الخصوصية"))
        {
            return "نحن نحترم خصوصيتك ونحمي معلوماتك الشخصية.";
        }
        else if(message.includes("ما هي سياسة الأمان"))
        {
            return "نستخدم تقنيات أمان متقدمة لحماية معلوماتك.";
        }

      else if(message.includes("ما اسمك"))
      {
          return "أنا بوت الدردشة الخاص بك!";
      }
      else if(message.includes("مساعدة"))
      {
          return "بالطبع! كيف يمكنني مساعدتك؟";
      }
      else if (message.includes("منتجات") || message.includes("products")) {
      return "🛍️ لدينا مجموعة واسعة من المنتجات. هل تبحث عن شيء محدد؟";
      } else if (message.includes("تخفيضات") || message.includes("discounts")) {
      return "🎉 لدينا تخفيضات رائعة! تحقق من قسم العروض.";
  }
      
   else if (message.includes("سعر") || message.includes("price")) {
      return "💰 الأسعار بتختلف حسب المنتج. ممكن توضح اسم المنتج؟";
    } else if (message.includes("توصيل") || message.includes("shipping")) {
      return "🚚 التوصيل خلال 3-5 أيام عمل.";
    } else if (message.includes("دفع") || message.includes("payment")) {
      return "💳 حالياً الدفع عند الاستلام فقط.";
    } else if (message.includes("مرحبا") || message.includes("hello")) {
      return "👋 أهلاً وسهلاً! كيف يمكنني مساعدتك؟";
    } else if (message.includes("شكرا") || message.includes("thanks")) {
      return "😊 العفو! نحن دائماً في خدمتك.";
    }
      else if (message.includes("معلومات") || message.includes("info")) {
          return "ℹ️ نحن هنا لمساعدتك في أي استفسار.";
      } else if (message.includes("تواصل") || message.includes("contact")) {
          return "📞 يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف.";
      } else if (message.includes("منتج") || message.includes("product")) {
          return "🛒 لدينا مجموعة متنوعة من المنتجات. هل تبحث عن شيء محدد؟";
      } else if (message.includes("تقييم") || message.includes("review")) {
          return "⭐️ نحب أن نسمع رأيك! كيف كان تجربتك؟";
      } else if (message.includes("موقع") || message.includes("location")) {
          return "📍 نحن موجودون في شارع التسوق الرئيسي.";
      } else if (message.includes("سؤال") || message.includes("question")) {
          return "❓ تفضل، اسألني أي شيء!";
      }
    else if (message.includes("اسعار الاحذية") || message.includes("shoe prices")) {
      return "👟 أسعار الأحذية تبدأ من 50 دولار. هل لديك نوع معين في بالك؟";        
    }
    else if (message.includes("اسعار الملابس") || message.includes("clothing prices")) {
        return "👗 أسعار الملابس تبدأ من 30 دولار. هل تبحث عن شيء معين؟";
    
    } else if (message.includes("اسعار الاكسسوارات") || message.includes("accessory prices")) {
        return "💍 أسعار الاكسسوارات تبدأ من 20 دولار. هل لديك شيء معين في بالك؟";
    }
    else if (message.includes("اسعار الالكترونيات") || message.includes("electronics prices")) {
        return "💻 أسعار الالكترونيات تبدأ من 100 دولار. هل تبحث عن شيء معين؟";
    }
    else if (message.includes("اسعار الهواتف") || message.includes("phone prices")) {
        return "📱 أسعار الهواتف تبدأ من 200 دولار. هل لديك نوع معين في بالك؟";
    }
    else if (message.includes("اسعار الاجهزة اللوحية") || message.includes("tablet prices")) {
        return "📱 أسعار الأجهزة اللوحية تبدأ من 150 دولار. هل لديك نوع معين في بالك؟";
    }
    else if (message.includes("اسعار الساعات") || message.includes("watch prices")) {
        return "⌚️ أسعار الساعات تبدأ من 80 دولار. هل لديك نوع معين في بالك؟";}

    else if (message.includes("اسعار النظارات") || message.includes("glasses prices")) {
        return "🕶️ أسعار النظارات تبدأ من 25 دولار. هل لديك نوع معين في بالك؟";
    }
    else if (message.includes("اديداس") || message.includes("adidas")) {
        return "👟 أديداس تقدم مجموعة رائعة من الأحذية الرياضية. ماهو مقاسك؟";
    }
    else if (message.includes("نايكي") || message.includes("nike")) {
        return "👟 نايكي تقدم أحذية رياضية مميزة. هل لديك تصميم مفضل؟";
    }
    else if (message.includes("فروتي") || message.includes("fruity")) {
        return "🍬 فروتي تقدم مجموعة متنوعة من الحلويات. هل لديك نوع مفضل؟";
    }
    else if (message.includes("شوكولاتة") || message.includes("chocolate")) {
        return "🍫 لدينا مجموعة متنوعة من الشوكولاتة. هل لديك نوع مفضل؟";}
    else if (message.includes("مكياج") || message.includes("makeup")) {
        return "💄 لدينا مجموعة رائعة من مستحضرات التجميل. هل لديك منتج معين في بالك؟";
    }
    else if (message.includes("عطور") || message.includes("perfumes")) {
        return "🌸 لدينا مجموعة متنوعة من العطور. هل لديك نوع مفضل؟";
    }
    else if (message.includes("مستحضرات") || message.includes("cosmetics")) {
        return "💅 لدينا مجموعة متنوعة من مستحضرات التجميل. هل لديك منتج معين في بالك؟";
    }
    else if (message.includes("مستحضرات العناية بالبشرة") || message.includes("skin care products")) {
        return "🧴 لدينا مجموعة متنوعة من مستحضرات العناية بالبشرة. هل لديك منتج معين في بالك؟";}
    else if (message.includes("مستحضرات العناية بالشعر") || message.includes("hair care products")) {
        return "💇 لدينا مجموعة متنوعة من مستحضرات العناية بالشعر. هل لديك منتج معين في بالك؟";}
        else {
        return "🤖 عذرًا، لم أفهم. حاول بصيغة مختلفة.";                    
    }
  }


  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userInput").addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  });