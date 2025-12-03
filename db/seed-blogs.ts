import { db } from './index'
import { blogs, users } from './schema'
import { createId } from '@paralleldrive/cuid2'

async function seedBlogs() {
  console.log('🌱 Seeding bilingual blogs...')

  try {
    // Get the first admin user to use as author
    const [adminUser] = await db.select().from(users).limit(1)

    if (!adminUser) {
      console.error('❌ No users found. Please seed users first.')
      return
    }

    const authorId = adminUser.id

    // Sample bilingual blog posts
    const sampleBlogs = [
      {
        authorId,
        languageCode: 'en' as const,
        // English content
        title: 'The Ultimate Guide to Hajj: A Spiritual Journey',
        excerpt: 'Discover everything you need to know about performing Hajj, from preparation to the sacred rituals in Mecca.',
        content: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>Introduction to Hajj</h2><p>Hajj is one of the five pillars of Islam and a once-in-a-lifetime obligation for Muslims who are physically and financially able to perform it. This comprehensive guide will help you understand the significance and steps of this sacred pilgrimage.</p><h2>Preparing for Your Journey</h2><p>Preparation is key to a successful Hajj experience. This includes physical preparation, spiritual readiness, and practical arrangements such as obtaining your visa, booking accommodation, and understanding the rituals.</p><h2>The Sacred Rituals</h2><p>From Ihram to Tawaf, from Sa\'i to standing at Arafat, each ritual holds deep spiritual significance. Understanding these rituals before your journey will enhance your spiritual experience.</p>',
          },
        ],
        // Arabic content
        titleAr: 'الدليل الشامل للحج: رحلة روحانية',
        excerptAr: 'اكتشف كل ما تحتاج لمعرفته حول أداء فريضة الحج، من التحضير إلى المناسك المقدسة في مكة المكرمة.',
        contentAr: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>مقدمة عن الحج</h2><p>الحج هو أحد أركان الإسلام الخمسة وواجب مرة واحدة في العمر للمسلمين القادرين جسديًا وماليًا على أدائه. سيساعدك هذا الدليل الشامل على فهم أهمية وخطوات هذه الرحلة المقدسة.</p><h2>الاستعداد لرحلتك</h2><p>التحضير هو مفتاح تجربة حج ناجحة. يشمل ذلك التحضير البدني والاستعداد الروحي والترتيبات العملية مثل الحصول على التأشيرة وحجز الإقامة وفهم المناسك.</p><h2>المناسك المقدسة</h2><p>من الإحرام إلى الطواف، ومن السعي إلى الوقوف بعرفة، كل منسك له أهمية روحية عميقة. فهم هذه المناسك قبل رحلتك سيعزز تجربتك الروحية.</p>',
          },
        ],
        category: 'Hajj & Umrah',
        tags: ['hajj', 'pilgrimage', 'mecca', 'spirituality', 'islam'],
        coverImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200',
        readTime: '8 min read',
        published: true,
        metaDescription: 'Complete guide to Hajj pilgrimage including preparation, rituals, and spiritual insights',
        metaKeywords: 'hajj, pilgrimage, mecca, islam, umrah',
        publishedAt: new Date(),
      },
      {
        authorId,
        languageCode: 'en' as const,
        // English content
        title: 'Exploring the Historic Sites of Medina',
        excerpt: 'Journey through the sacred city of Medina and discover its rich Islamic heritage and historic landmarks.',
        content: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>The Prophet\'s Mosque</h2><p>Al-Masjid an-Nabawi, the Prophet\'s Mosque, is one of the largest mosques in the world and the second holiest site in Islam. Learn about its history, architecture, and significance.</p><h2>Mount Uhud</h2><p>Visit the site of the famous Battle of Uhud and pay respects at the martyrs\' cemetery. This historic location offers both spiritual reflection and historical insights.</p><h2>Quba Mosque</h2><p>The first mosque built in Islam, Quba Mosque holds special significance. Discover the rewards of praying here and its role in Islamic history.</p>',
          },
        ],
        // Arabic content
        titleAr: 'استكشاف المواقع التاريخية في المدينة المنورة',
        excerptAr: 'رحلة عبر المدينة المقدسة واكتشف تراثها الإسلامي الغني ومعالمها التاريخية.',
        contentAr: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>المسجد النبوي الشريف</h2><p>المسجد النبوي هو أحد أكبر المساجد في العالم وثاني أقدس موقع في الإسلام. تعرف على تاريخه وعمارته وأهميته.</p><h2>جبل أحد</h2><p>قم بزيارة موقع غزوة أحد الشهيرة وزيارة مقبرة الشهداء. يوفر هذا الموقع التاريخي تأملاً روحياً ورؤى تاريخية.</p><h2>مسجد قباء</h2><p>أول مسجد بني في الإسلام، يحمل مسجد قباء أهمية خاصة. اكتشف ثواب الصلاة فيه ودوره في التاريخ الإسلامي.</p>',
          },
        ],
        category: 'Travel Guide',
        tags: ['medina', 'history', 'mosque', 'islamic-heritage', 'saudi-arabia'],
        coverImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200',
        readTime: '6 min read',
        published: true,
        metaDescription: 'Explore the historic sites and landmarks of Medina including the Prophet\'s Mosque',
        metaKeywords: 'medina, prophets mosque, islamic sites, saudi arabia',
        publishedAt: new Date(),
      },
      {
        authorId,
        languageCode: 'en' as const,
        // English content
        title: 'Umrah Guide: Step by Step Rituals',
        excerpt: 'A comprehensive guide to performing Umrah with detailed explanations of each ritual and their spiritual significance.',
        content: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>What is Umrah?</h2><p>Umrah is a pilgrimage to Mecca that can be performed at any time of the year, unlike Hajj which has specific dates. While not obligatory, it is highly recommended and brings immense spiritual rewards.</p><h2>The Steps of Umrah</h2><p>The main rituals include entering into Ihram, performing Tawaf around the Kaaba, Sa\'i between Safa and Marwa, and completing with Halq or Taqsir.</p><h2>Tips for First-Time Pilgrims</h2><p>Practical advice for those performing Umrah for the first time, including what to pack, how to prepare spiritually, and common mistakes to avoid.</p>',
          },
        ],
        // Arabic content
        titleAr: 'دليل العمرة: خطوات المناسك بالتفصيل',
        excerptAr: 'دليل شامل لأداء العمرة مع شرح مفصل لكل منسك وأهميته الروحية.',
        contentAr: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>ما هي العمرة؟</h2><p>العمرة هي حج إلى مكة يمكن أداؤها في أي وقت من السنة، على عكس الحج الذي له مواعيد محددة. وعلى الرغم من أنها ليست واجبة، إلا أنها مستحبة للغاية وتجلب أجرًا روحيًا عظيمًا.</p><h2>خطوات العمرة</h2><p>تشمل المناسك الرئيسية الدخول في الإحرام، وأداء الطواف حول الكعبة، والسعي بين الصفا والمروة، والانتهاء بالحلق أو التقصير.</p><h2>نصائح للحجاج لأول مرة</h2><p>نصائح عملية لمن يؤدون العمرة لأول مرة، بما في ذلك ما يجب إحضاره، وكيفية الاستعداد روحياً، والأخطاء الشائعة التي يجب تجنبها.</p>',
          },
        ],
        category: 'Hajj & Umrah',
        tags: ['umrah', 'pilgrimage', 'mecca', 'kaaba', 'islamic-rituals'],
        coverImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200',
        readTime: '7 min read',
        published: true,
        metaDescription: 'Complete step-by-step guide to performing Umrah including all rituals and preparations',
        metaKeywords: 'umrah, pilgrimage, mecca, tawaf, islamic rituals',
        publishedAt: new Date(),
      },
      {
        authorId,
        languageCode: 'en' as const,
        // English content
        title: 'Best Hotels Near Haram in Mecca',
        excerpt: 'Discover the top-rated hotels near the Grand Mosque offering comfort, convenience, and stunning views of the Kaaba.',
        content: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>Location Matters</h2><p>Staying close to Haram ensures easy access for prayers and minimizes travel time, allowing you to focus on your worship and spiritual journey.</p><h2>Premium Hotels</h2><p>Explore luxury accommodations with world-class amenities, including direct views of the Kaaba, 5-star service, and premium dining options.</p><h2>Budget-Friendly Options</h2><p>Quality hotels that offer great value without compromising on comfort or proximity to the Grand Mosque.</p>',
          },
        ],
        // Arabic content
        titleAr: 'أفضل الفنادق بالقرب من الحرم في مكة',
        excerptAr: 'اكتشف الفنادق الأعلى تقييماً بالقرب من المسجد الحرام التي توفر الراحة والملاءمة وإطلالات خلابة على الكعبة.',
        contentAr: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>أهمية الموقع</h2><p>الإقامة بالقرب من الحرم تضمن سهولة الوصول للصلوات وتقلل من وقت السفر، مما يتيح لك التركيز على عبادتك ورحلتك الروحية.</p><h2>الفنادق الفاخرة</h2><p>استكشف أماكن الإقامة الفاخرة مع وسائل الراحة العالمية، بما في ذلك إطلالات مباشرة على الكعبة، وخدمة خمس نجوم، وخيارات طعام راقية.</p><h2>خيارات اقتصادية</h2><p>فنادق عالية الجودة توفر قيمة رائعة دون المساس بالراحة أو القرب من المسجد الحرام.</p>',
          },
        ],
        category: 'Accommodation',
        tags: ['hotels', 'mecca', 'haram', 'accommodation', 'lodging'],
        coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
        readTime: '5 min read',
        published: true,
        metaDescription: 'Top hotels near Masjid al-Haram in Mecca for pilgrims seeking comfort and convenience',
        metaKeywords: 'mecca hotels, haram hotels, kaaba view, pilgrimage accommodation',
        publishedAt: new Date(),
      },
      {
        authorId,
        languageCode: 'en' as const,
        // English content
        title: 'Health and Safety Tips for Pilgrims',
        excerpt: 'Essential health and safety guidelines to ensure a safe and healthy pilgrimage experience.',
        content: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>Before You Travel</h2><p>Get necessary vaccinations, prepare a medical kit, and consult your doctor about any health concerns. Ensure you have adequate health insurance coverage.</p><h2>During Your Pilgrimage</h2><p>Stay hydrated, protect yourself from the sun, maintain good hygiene, and be aware of crowd safety measures during peak times.</p><h2>Emergency Contacts</h2><p>Keep important phone numbers handy including local emergency services, your embassy, and hotel contacts.</p>',
          },
        ],
        // Arabic content
        titleAr: 'نصائح صحية وسلامة للحجاج',
        excerptAr: 'إرشادات صحية وأمنية أساسية لضمان تجربة حج آمنة وصحية.',
        contentAr: [
          {
            type: 'text' as const,
            id: createId(),
            data: '<h2>قبل السفر</h2><p>احصل على التطعيمات اللازمة، وجهز حقيبة طبية، واستشر طبيبك بشأن أي مخاوف صحية. تأكد من وجود تأمين صحي كافٍ.</p><h2>أثناء الحج</h2><p>حافظ على رطوبة جسمك، واحمِ نفسك من الشمس، وحافظ على النظافة الشخصية، وكن على دراية بتدابير السلامة في الحشود خلال الأوقات المزدحمة.</p><h2>جهات الاتصال في حالات الطوارئ</h2><p>احتفظ بأرقام الهواتف المهمة في متناول يدك بما في ذلك خدمات الطوارئ المحلية وسفارتك وجهات اتصال الفندق.</p>',
          },
        ],
        category: 'Tips & Advice',
        tags: ['health', 'safety', 'pilgrimage', 'wellness', 'travel-tips'],
        coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200',
        readTime: '6 min read',
        published: true,
        metaDescription: 'Important health and safety tips for pilgrims traveling to Mecca and Medina',
        metaKeywords: 'hajj health, pilgrimage safety, travel health, mecca safety',
        publishedAt: new Date(),
      },
    ]

    // Insert blogs
    for (const blog of sampleBlogs) {
      await db.insert(blogs).values(blog)
      console.log(`✅ Created blog: ${blog.title}`)
    }

    console.log('✨ Successfully seeded blogs!')
  } catch (error) {
    console.error('❌ Error seeding blogs:', error)
    throw error
  }
}

// Run the seed function
seedBlogs()
  .then(() => {
    console.log('🎉 Blog seeding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed to seed blogs:', error)
    process.exit(1)
  })
