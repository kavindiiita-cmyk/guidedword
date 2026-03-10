const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'database.db');

async function seed() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      meta_title TEXT NOT NULL,
      meta_description TEXT NOT NULL,
      story_context TEXT NOT NULL,
      verse_reference TEXT NOT NULL,
      verse_text TEXT NOT NULL,
      reflection_text TEXT NOT NULL,
      quiz_question TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option TEXT NOT NULL,
      quiz_explanation TEXT NOT NULL
    );
  `);

  const articles = [
    {
      slug: 'david-fear',
      title: 'When Fear Feels Overwhelming \u2014 David Hiding from Saul',
      meta_title: 'Finding Peace in Fear \u2014 Psalm 56:3 | Scripture for Anxiety',
      meta_description: 'When David hid in a cave from King Saul, he wrote one of the most honest prayers about fear. Discover how Psalm 56:3 can bring you comfort today.',
      story_context: "There are moments when fear doesn\u2019t just knock at the door \u2014 it moves in. You feel hunted by worry, cornered by circumstances you can\u2019t control. David knew this feeling intimately. He was anointed as the future king of Israel, yet he spent years running for his life from King Saul, hiding in caves, sleeping in the wilderness, never knowing if the next day would be his last. He wasn\u2019t living in theoretical danger \u2014 he was being actively pursued by a powerful, jealous king with an army. In the middle of that terror, David didn\u2019t pretend to be brave. He wrote honestly about his fear, and then he made a choice \u2014 to trust anyway.",
      verse_reference: 'Psalm 56:3',
      verse_text: 'When I am afraid, I put my trust in you.',
      reflection_text: "Notice that David doesn\u2019t say \u201cI am never afraid.\u201d He says \u201cwhen I am afraid.\u201d Fear is not a failure of faith \u2014 it is a human experience that even the greatest figures in scripture faced. What matters is not whether fear arrives, but what you do when it does. David\u2019s words remind us that trust is not the absence of fear. Trust is the quiet decision to turn toward God even when everything inside you is shaking. If you are afraid right now, you are in good company. And you are allowed to bring that fear to God exactly as it is.",
      quiz_question: 'What does David say he does when he feels afraid?',
      option_a: 'He fights back immediately',
      option_b: 'He puts his trust in God',
      option_c: 'He runs to a different city',
      option_d: 'He calls his friends for help',
      correct_option: 'B',
      quiz_explanation: 'In Psalm 56:3, David writes \u201cWhen I am afraid, I put my trust in you.\u201d Rather than denying his fear or relying only on his own strength, David chose to place his trust in God \u2014 acknowledging the fear honestly while turning toward faith.'
    },
    {
      slug: 'elijah-exhaustion',
      title: 'When You Feel Too Exhausted to Go On \u2014 Elijah in the Wilderness',
      meta_title: 'Rest for the Exhausted Soul \u2014 1 Kings 19 | Scripture for Burnout',
      meta_description: 'Elijah collapsed under a tree and asked God to let him die. Learn how God responded with rest, food, and gentle presence \u2014 and what it means for you today.',
      story_context: "Sometimes exhaustion goes deeper than the body. Your spirit feels hollow. You have given everything \u2014 your energy, your courage, your hope \u2014 and there is simply nothing left. The prophet Elijah understood this kind of bone-deep weariness. He had just experienced one of the greatest victories in scripture, calling down fire from heaven on Mount Carmel. Yet immediately after, when Queen Jezebel threatened his life, he ran into the wilderness, collapsed under a broom tree, and prayed to die. He said, \u201cIt is enough; now, Lord, take my life.\u201d This was not weakness. This was a faithful man who had poured out everything and hit the wall.",
      verse_reference: '1 Kings 19:12',
      verse_text: 'After the fire came a gentle whisper.',
      reflection_text: "What strikes many readers about this passage is what God did not do. He did not lecture Elijah. He did not scold him for running. He did not give him a motivational speech. Instead, God sent an angel with bread and water, and let Elijah sleep. Twice. God\u2019s first response to Elijah\u2019s despair was physical care \u2014 rest and nourishment. If you are running on empty right now, consider that God may not be asking you to do more. He may be asking you to rest. Sometimes the most spiritual thing you can do is sleep, eat, and let yourself be cared for. You are not behind. You are not failing. You are human, and God already knows that.",
      quiz_question: 'How did God respond when Elijah was exhausted and wanted to give up?',
      option_a: 'God scolded Elijah for being weak',
      option_b: 'God immediately gave him a new mission',
      option_c: 'God provided food, water, and rest',
      option_d: 'God told him to pray harder',
      correct_option: 'C',
      quiz_explanation: "In 1 Kings 19, God\u2019s response to Elijah\u2019s exhaustion was remarkably gentle. He sent an angel with bread and water and allowed Elijah to sleep \u2014 twice. God addressed Elijah\u2019s physical needs before anything else, showing that rest is not weakness but part of God\u2019s care for us."
    },
    {
      slug: 'jesus-calming-storm',
      title: 'When Life Feels Like a Storm \u2014 Jesus Calming the Sea',
      meta_title: 'Peace in the Storm \u2014 Mark 4:39 | Scripture for Stress and Worry',
      meta_description: 'The disciples were terrified in a violent storm while Jesus slept peacefully. Discover what \u201cPeace, be still\u201d means for your anxious heart today.',
      story_context: "Have you ever felt like everything around you is falling apart, and the one person who could help seems completely unaware? The disciples experienced this in the most literal way possible. They were crossing the Sea of Galilee when a furious storm arose \u2014 waves crashing over the boat, water pouring in. They were experienced fishermen, and even they were terrified. Meanwhile, Jesus was asleep on a cushion in the stern. They woke him in a panic: \u201cTeacher, don\u2019t you care if we drown?\u201d It\u2019s a question many of us have whispered in our own storms \u2014 God, do you even see what\u2019s happening to me?",
      verse_reference: 'Mark 4:39',
      verse_text: 'Quiet! Be still!',
      reflection_text: "Jesus didn\u2019t just calm the storm \u2014 he spoke directly to it. \u201cQuiet. Be still.\u201d And the chaos obeyed. But before he calmed the sea, he asked his disciples a question: \u201cWhy are you so afraid? Do you still have no faith?\u201d This wasn\u2019t a rebuke \u2014 it was an invitation. Jesus was showing them that his peace was available even before the storm ended. The same is true for you. You may be in the middle of a storm right now \u2014 financial pressure, health concerns, relationship pain \u2014 and the waves feel relentless. But the same voice that silenced the sea is present with you. Peace doesn\u2019t always mean the storm disappears. Sometimes peace means knowing who is in the boat with you.",
      quiz_question: 'What did Jesus say to the wind and waves during the storm?',
      option_a: '\u201cDo not be afraid, I am here\u201d',
      option_b: '\u201cHave faith and the storm will pass\u201d',
      option_c: '\u201cQuiet! Be still!\u201d',
      option_d: '\u201cPray together and you will be saved\u201d',
      correct_option: 'C',
      quiz_explanation: 'In Mark 4:39, Jesus spoke directly to the storm with authority: \u201cQuiet! Be still!\u201d The wind died down and it was completely calm. This reveals that Jesus has authority over nature itself, and his peace is powerful enough to silence any storm \u2014 including the ones inside us.'
    },
    {
      slug: 'paul-prison-peace',
      title: 'Finding Peace in Impossible Circumstances \u2014 Paul Writing from Prison',
      meta_title: 'Peace Beyond Understanding \u2014 Philippians 4:6-7 | Scripture for Anxiety Relief',
      meta_description: 'Paul wrote about peace while chained in a Roman prison. Learn how Philippians 4:6-7 offers real comfort for anxiety and worry today.',
      story_context: "It\u2019s easy to talk about peace when life is comfortable. But what about when your freedom has been taken away? When you\u2019re sitting in a cold cell, uncertain whether you\u2019ll live or die? The apostle Paul wrote his letter to the Philippians from a Roman prison. He was chained, guarded, and facing possible execution. Yet this letter is one of the most joy-filled books in the entire Bible. It was from this place \u2014 not a retreat center, not a mountaintop \u2014 that Paul wrote some of the most powerful words about peace ever recorded. He wasn\u2019t theorizing. He was living it.",
      verse_reference: 'Philippians 4:6',
      verse_text: 'Do not be anxious about anything.',
      reflection_text: "Paul doesn\u2019t say \u201cstop worrying and figure it out.\u201d He offers a practice: bring everything to God in prayer, with thanksgiving. The thanksgiving part is key \u2014 it shifts our focus from what\u2019s wrong to what God has already done. And then comes the promise: peace that transcends all understanding. This isn\u2019t a peace that makes logical sense. It\u2019s the kind of peace that guards your heart even when your circumstances haven\u2019t changed. If you are anxious right now, Paul\u2019s invitation is simple. Don\u2019t carry it alone. Speak it to God \u2014 every worry, every fear, every \u201cwhat if.\u201d And then let the peace that doesn\u2019t make sense do its quiet, powerful work.",
      quiz_question: 'According to Philippians 4:6-7, what should we do instead of being anxious?',
      option_a: 'Distract ourselves with activity',
      option_b: 'Present our requests to God with prayer and thanksgiving',
      option_c: 'Talk to friends about our problems',
      option_d: 'Wait patiently until the situation changes',
      correct_option: 'B',
      quiz_explanation: 'Paul instructs us to bring everything to God \u201cby prayer and petition, with thanksgiving.\u201d The result is \u201cthe peace of God, which transcends all understanding\u201d guarding our hearts and minds. It\u2019s an active practice of turning worry into prayer, and God responds with supernatural peace.'
    },
    // === STRENGTH CATEGORY ===
    {
      slug: 'strength-difficult-times',
      title: 'Bible Verses for Strength in Difficult Times',
      meta_title: 'Bible Verses for Strength in Difficult Times \u2014 David and Goliath | Scripture for Anxiety',
      meta_description: 'When life feels impossible, David\u2019s story reminds us that God fights our battles. Find calming Bible verses for strength in your hardest moments.',
      story_context: "Some days the weight is almost physical. You wake up and the problem is still there \u2014 the diagnosis, the financial pressure, the relationship falling apart, the job that drains you. You wonder how much longer you can keep going. You try to hold it together for the people around you, but inside you feel like you\u2019re running out of strength. If that\u2019s where you are right now, please hear this: you are not weak for feeling this way. Difficult times are not a sign that something is wrong with your faith. They are a sign that you are human.\n\nDavid was just a shepherd boy when he walked onto the most terrifying battlefield in Israel\u2019s history. The giant Goliath had paralyzed an entire army. Trained soldiers refused to fight. But David, who had no armor and no military experience, stepped forward. Not because he was fearless \u2014 but because he had seen God show up before. He had fought a lion and a bear while protecting his sheep, and he knew that the same God who helped him then would help him now. David didn\u2019t trust in his own strength. He trusted in the One who gave it.",
      verse_reference: '1 Samuel 17:47',
      verse_text: 'The battle is the Lord\u2019s.',
      reflection_text: "David\u2019s words before facing Goliath were not a battle cry \u2014 they were a declaration of trust. He was telling everyone present that the outcome did not depend on swords or spears or human power. It depended on God. This is an extraordinary thing to say when a nine-foot warrior is staring you down. But David had learned something most of us take a lifetime to understand: when the battle is too big for you, it\u2019s the right size for God.\n\nIf you are facing something that feels impossibly large right now \u2014 a mountain of debt, a health crisis, a broken family, an uncertain future \u2014 David\u2019s words are for you too. You do not have to win this on your own. You do not have to be the strongest person in the room. You simply have to show up and let God do what only God can do. Strength in difficult times doesn\u2019t come from gritting your teeth harder. It comes from releasing your grip and letting the One who made you carry what you cannot.",
      quiz_question: 'What did David declare before facing Goliath?',
      option_a: 'I am the strongest warrior in Israel',
      option_b: 'The battle is the Lord\u2019s',
      option_c: 'I will defeat you with my sword',
      option_d: 'My army will protect me',
      correct_option: 'B',
      quiz_explanation: 'In 1 Samuel 17:47, David declared \u201cThe battle is the Lord\u2019s.\u201d He didn\u2019t rely on weapons or military training. He trusted that God would fight for him \u2014 and God did. This reminds us that our hardest battles are not ours to fight alone.'
    },
    {
      slug: 'strength-hard-work',
      title: 'Bible Verses for Strength During Hard Work',
      meta_title: 'Bible Verses for Strength During Hard Work \u2014 Joshua Leading Israel | Scripture for Perseverance',
      meta_description: 'When the work feels endless and you\u2019re running on empty, Joshua\u2019s story shows that God walks with you through every hard step.',
      story_context: "Maybe you\u2019re not facing a single dramatic crisis. Maybe it\u2019s the slow grind that\u2019s wearing you down \u2014 the long hours, the thankless responsibilities, the endless to-do list that never gets shorter. You\u2019re doing everything right, but you\u2019re exhausted. Hard work is honorable, but when it stretches on without rest or recognition, it can hollow you out. If you feel like you\u2019re carrying more than your share, you\u2019re not imagining it.\n\nJoshua faced one of the most overwhelming tasks in scripture. After Moses died, God told Joshua to lead an entire nation \u2014 millions of people \u2014 across the Jordan River and into a land filled with fortified cities and hostile armies. He had no roadmap, no guarantee of easy victory, and the weight of leadership fell entirely on his shoulders. The people were watching him, expecting him to have all the answers. That kind of pressure can break anyone. But before Joshua took a single step, God spoke to him \u2014 not with a strategy briefing, but with reassurance.",
      verse_reference: 'Joshua 1:9',
      verse_text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
      reflection_text: "Notice that God didn\u2019t say \u201cBe strong because you are capable.\u201d He said \u201cBe strong because I am with you.\u201d That\u2019s a completely different foundation. Joshua\u2019s courage was not supposed to come from his own ability or experience. It was supposed to come from the presence of God walking beside him. The same is true for you.\n\nWhen the work feels relentless and your energy is gone, you don\u2019t need to manufacture motivation from within. You need to remember that you are not doing this alone. God is not watching from a distance while you struggle. He is with you \u2014 in the early mornings, in the late nights, in the thankless tasks that no one sees. The promise to Joshua was not that the work would be easy. It was that God would never leave him in the middle of it. That promise hasn\u2019t changed. Whatever you\u2019re carrying today, carry it knowing that Someone stronger is carrying it with you.",
      quiz_question: 'What did God tell Joshua before he led Israel into the promised land?',
      option_a: 'You must train harder than everyone else',
      option_b: 'Be strong and courageous, for I will be with you',
      option_c: 'Build an army before you cross the river',
      option_d: 'Wait until you feel ready before moving forward',
      correct_option: 'B',
      quiz_explanation: 'In Joshua 1:9, God told Joshua to be strong and courageous \u2014 not because of his own abilities, but because God promised to be with him wherever he went. True strength during hard work comes from knowing we are not alone in it.'
    },
    {
      slug: 'strength-when-weak',
      title: 'Bible Verses for Strength When You Feel Weak',
      meta_title: 'Bible Verses for Strength When You Feel Weak \u2014 Paul\u2019s Thorn | Scripture for Vulnerability',
      meta_description: 'Paul begged God to remove his suffering three times. God\u2019s answer changed everything. Find comfort in Bible verses for when you feel weak.',
      story_context: "There\u2019s a particular kind of pain that comes from feeling weak when you think you should be strong. Maybe everyone around you seems to be handling life just fine, and you\u2019re the one struggling to get through the day. Maybe you\u2019ve prayed for strength and it hasn\u2019t come the way you expected. Weakness can feel like failure, but it\u2019s not. It\u2019s simply the honest truth of being human.\n\nThe apostle Paul was one of the most resilient people in the entire Bible. He survived shipwrecks, beatings, imprisonment, and constant opposition. But he also had something he called a \u201cthorn in the flesh\u201d \u2014 a persistent source of suffering that he never fully explained. What we do know is that Paul begged God three times to take it away. Three times. This was not a casual prayer. It was desperate pleading from a man who had reached his limit. And God\u2019s answer was not what Paul expected.",
      verse_reference: '2 Corinthians 12:9',
      verse_text: 'My grace is sufficient for you, for my power is made perfect in weakness.',
      reflection_text: "God didn\u2019t remove the thorn. He didn\u2019t explain why it was there. Instead, He told Paul something that redefines how we think about strength: \u201cMy power is made perfect in weakness.\u201d This means that the very thing you\u2019re ashamed of \u2014 your exhaustion, your inability to cope, your breaking point \u2014 is the exact place where God\u2019s power shows up most clearly.\n\nWe live in a world that worships self-sufficiency. Admitting weakness feels dangerous. But God operates on a completely different system. In His economy, the people who admit they can\u2019t do it alone are the ones who experience His strength most fully. If you feel weak today, you are not disqualified from God\u2019s work. You are positioned for it. Your weakness is not the end of the story. It\u2019s the place where grace begins.",
      quiz_question: 'How did God respond when Paul begged for his suffering to be removed?',
      option_a: 'God removed the thorn immediately',
      option_b: 'God said Paul needed to pray harder',
      option_c: 'God said His grace is sufficient and His power is made perfect in weakness',
      option_d: 'God told Paul to endure it silently',
      correct_option: 'C',
      quiz_explanation: 'In 2 Corinthians 12:9, God told Paul \u201cMy grace is sufficient for you, for my power is made perfect in weakness.\u201d Rather than removing the suffering, God revealed that His strength works best through our honest vulnerability.'
    },
    {
      slug: 'strength-during-uncertainty',
      title: 'Bible Verses for Strength During Uncertainty',
      meta_title: 'Bible Verses for Strength During Uncertainty \u2014 Moses and God\u2019s Promise | Scripture for Anxious Times',
      meta_description: 'When you don\u2019t know what comes next, Moses\u2019 story reminds you that God goes before you. Find Bible verses for uncertainty and fear of the unknown.',
      story_context: "Not knowing is one of the hardest forms of suffering. You can endure almost anything if you know when it will end. But when the future is blank \u2014 when you don\u2019t know if the job will come through, if the test results will be okay, if the relationship will survive \u2014 uncertainty wraps around your chest and squeezes. Your mind races through every possible outcome, most of them terrible. You try to plan for every scenario, but you can\u2019t. And the waiting is unbearable.\n\nMoses spent his final days preparing to hand leadership of Israel to Joshua. After forty years of guiding a nation through the wilderness, Moses would not be the one to lead them into the promised land. He was passing the weight to a younger man who had never done this before. Joshua was stepping into the complete unknown \u2014 new territory, new enemies, new responsibilities, and the loss of his mentor. Moses knew the fear Joshua was carrying, so he spoke directly to it \u2014 not with tactics, but with a truth about God\u2019s character.",
      verse_reference: 'Deuteronomy 31:8',
      verse_text: 'The Lord himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.',
      reflection_text: "Moses didn\u2019t tell Joshua that everything would be easy. He didn\u2019t promise quick victories or a smooth road ahead. What he gave Joshua was something far more valuable: the assurance that God would be there first. \u201cThe Lord himself goes before you.\u201d Before Joshua set foot in any new territory, God was already there.\n\nThis truth is for every moment when you cannot see what\u2019s coming. When you\u2019re waiting for medical results, when you\u2019re starting over in a new city, when you\u2019re walking into a season that feels completely unfamiliar \u2014 God is not behind you, watching to see what happens. He is already ahead of you, preparing the ground. You do not have to have the future figured out. You do not need a detailed plan for every possibility. You need only to take the next step, trusting that the God who goes before you has already been where you\u2019re going. He will not leave you. He will not forget you. He is already there.",
      quiz_question: 'What truth did Moses give Joshua before Israel entered the unknown land?',
      option_a: 'You are strong enough to handle this alone',
      option_b: 'The Lord goes before you and will never leave you',
      option_c: 'Make a detailed plan for every battle',
      option_d: 'Wait until you feel confident to move forward',
      correct_option: 'B',
      quiz_explanation: 'In Deuteronomy 31:8, Moses assured Joshua that \u201cThe Lord himself goes before you and will be with you; he will never leave you nor forsake you.\u201d In times of uncertainty, our comfort is not in knowing the plan but in knowing the One who goes ahead of us.'
    },
    // === SLEEP CATEGORY ===
    {
      slug: 'peaceful-sleep',
      title: 'Bible Verses for Peaceful Sleep',
      meta_title: 'Bible Verses for Peaceful Sleep \u2014 Psalm 4:8 | Scripture for Restful Nights',
      meta_description: 'When you can\u2019t fall asleep because your mind won\u2019t stop, Psalm 4:8 offers a gentle promise of safety and rest. Find calming verses for peaceful sleep.',
      story_context: "The house is quiet but your mind is loud. You\u2019ve turned off the lights, pulled up the covers, and closed your eyes \u2014 but sleep won\u2019t come. Instead, every worry you managed to suppress during the day comes flooding back. The bills, the conflict, the things you said that you wish you hadn\u2019t, the things you should have said but didn\u2019t. Night has a way of amplifying everything. Problems that felt manageable at noon feel crushing at midnight.\n\nDavid knew what it was like to lie awake at night. He was a king, but his life was full of threats \u2014 enemies plotting against him, family members betraying him, wars on every border. The pressure was constant. Yet in the middle of all that turmoil, David wrote a prayer that has comforted anxious sleepers for three thousand years. It wasn\u2019t a prayer for his problems to disappear. It was a prayer about where he placed his trust when the lights went out.",
      verse_reference: 'Psalm 4:8',
      verse_text: 'In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety.',
      reflection_text: "There are two beautiful things in this verse. First, David says he will lie down \u201cin peace.\u201d Not because his circumstances were peaceful \u2014 they absolutely were not \u2014 but because he chose to release his grip on the things he could not control. Second, he says God alone makes him dwell in safety. Not his army, not his palace walls, not his own vigilance. God alone.\n\nWhen you can\u2019t sleep, it\u2019s often because your mind is trying to be its own security system \u2014 scanning for threats, rehearsing disasters, trying to solve tomorrow\u2019s problems tonight. But David\u2019s prayer gently pushes back on that instinct. You don\u2019t have to be your own protector tonight. You don\u2019t have to figure everything out before morning. The God who watches over you does not sleep, does not get tired, and does not forget about you. You can close your eyes because Someone else is keeping watch.",
      quiz_question: 'In Psalm 4:8, what allows David to sleep in peace?',
      option_a: 'His strong army protecting the city',
      option_b: 'Solving all his problems before bed',
      option_c: 'God alone making him dwell in safety',
      option_d: 'Having no worries or enemies',
      correct_option: 'C',
      quiz_explanation: 'David writes that he can lie down and sleep in peace because \u201cyou alone, Lord, make me dwell in safety.\u201d His peace didn\u2019t come from resolved circumstances but from trusting God as his protector through the night.'
    },
    {
      slug: 'anxiety-at-night',
      title: 'Bible Verses for Anxiety at Night',
      meta_title: 'Bible Verses for Anxiety at Night \u2014 1 Peter 5:7 | Scripture for Nighttime Worry',
      meta_description: 'When anxiety keeps you awake at night, scripture offers a gentle invitation to release your burdens. Find Bible verses for anxious nights.',
      story_context: "Nighttime anxiety has a cruelty to it that daytime worry doesn\u2019t. During the day, you can distract yourself \u2014 work, conversations, movement. But at night, there\u2019s nowhere to hide. The fears come unchecked and unfiltered. Your heart races. Your thoughts spiral. You check the clock and it\u2019s 2 AM and you know you need to sleep but knowing that only makes the anxiety worse. You feel trapped in your own mind.\n\nPeter, the disciple who walked with Jesus, understood what it was like to be consumed by fear. He once literally sank into the sea because his fear overwhelmed his faith. He denied Jesus three times out of terror. Peter was no stranger to the kind of anxiety that grips you and won\u2019t let go. But later in his life, after years of walking through hard things with God, Peter wrote words that carry the weight of lived experience \u2014 not theory, but testimony from someone who had been in the grip of fear and found a way out.",
      verse_reference: '1 Peter 5:7',
      verse_text: 'Cast all your anxiety on him because he cares for you.',
      reflection_text: "The word \u201ccast\u201d is important. It doesn\u2019t mean \u201cgently set down.\u201d It means throw. Hurl. Get it off you with force. Peter is saying: take the weight that is crushing you and throw it at God. Don\u2019t hold back the polite version of your worry. Don\u2019t edit your prayers to sound more spiritual. Throw the raw, messy, 2 AM panic at Him.\n\nAnd then the reason: \u201cbecause he cares for you.\u201d Not because you\u2019ve earned it. Not because your faith is strong enough. Simply because He cares. When anxiety grips you at night, it whispers that you\u2019re alone, that nobody understands, that the worst will happen. But this verse pushes back with a truth that anxiety cannot argue with: God cares for you. Personally. Right now. In this dark room at this late hour. You are not an afterthought to Him. The invitation is open every night, no matter how many times you need it: cast it on Him. He can hold it.",
      quiz_question: 'According to 1 Peter 5:7, why can we cast our anxiety on God?',
      option_a: 'Because anxiety is sinful',
      option_b: 'Because we must be strong on our own',
      option_c: 'Because he cares for us',
      option_d: 'Because worrying is not productive',
      correct_option: 'C',
      quiz_explanation: 'Peter tells us to cast all our anxiety on God for one beautifully simple reason: \u201cbecause he cares for you.\u201d The foundation of this invitation isn\u2019t our performance or faith level \u2014 it\u2019s God\u2019s personal care for us.'
    },
    {
      slug: 'rest-mind-wont-stop',
      title: 'Bible Verses for Rest When the Mind Won\u2019t Stop',
      meta_title: 'Bible Verses for Rest When the Mind Won\u2019t Stop \u2014 Psalm 23 | Scripture for Overthinking',
      meta_description: 'When your thoughts won\u2019t slow down and rest feels impossible, Psalm 23 offers a picture of God leading you to still waters. Find verses for a restless mind.',
      story_context: "Your body is tired but your brain won\u2019t cooperate. It replays conversations. It builds worst-case scenarios. It jumps from one worry to the next like a restless bird that can\u2019t find a branch to land on. You\u2019ve tried breathing exercises. You\u2019ve tried counting sheep. You\u2019ve tried telling yourself to just stop thinking. But a racing mind doesn\u2019t respond to commands. It needs something deeper than technique. It needs to feel safe.\n\nDavid spent much of his early life as a shepherd, long before he became king. He knew what it took to lead anxious, restless animals to places of nourishment and rest. Sheep are easily startled. They won\u2019t drink from rushing water because the noise frightens them and the current threatens to pull them under. A good shepherd has to find quiet streams \u2014 still, safe water \u2014 and leads the sheep there gently. David understood this instinct so deeply that when he described his relationship with God, he used the same image. God doesn\u2019t drag us to rest. He leads us there.",
      verse_reference: 'Psalm 23:2',
      verse_text: 'He makes me lie down in green pastures, he leads me beside quiet waters.',
      reflection_text: "There\u2019s something striking about the phrase \u201che makes me lie down.\u201d Sheep don\u2019t lie down unless they feel completely safe \u2014 free from fear, free from hunger, free from tension with the flock. A shepherd who can make sheep lie down has created an environment of total peace. That\u2019s what God wants to do for your mind.\n\nWhen your thoughts are racing, God is not standing at a distance telling you to calm down. He is actively leading you somewhere quieter. The green pastures and still waters are not a place you have to find on your own. God brings you there. Your job is not to force your mind into silence. Your job is to follow the Shepherd. Tonight, instead of fighting your thoughts, try handing each one to God as it comes. Let Him lead you beside the quiet waters. Rest is not something you manufacture. It\u2019s something you receive from a Shepherd who knows exactly what you need.",
      quiz_question: 'In Psalm 23, what does the shepherd lead the sheep beside?',
      option_a: 'Roaring rivers',
      option_b: 'Quiet waters',
      option_c: 'Busy marketplaces',
      option_d: 'High mountain peaks',
      correct_option: 'B',
      quiz_explanation: 'David writes that God \u201cleads me beside quiet waters.\u201d Just as a shepherd leads sheep to calm streams where they feel safe enough to drink and rest, God leads us to places of peace when our minds are restless and overwhelmed.'
    },
    {
      slug: 'psalms-nighttime-comfort',
      title: 'Psalms for Nighttime Comfort',
      meta_title: 'Psalms for Nighttime Comfort \u2014 Psalm 63:6 | Scripture for Sleepless Nights',
      meta_description: 'When sleep won\u2019t come and the night feels long, the Psalms offer a gentle companion for your darkest hours. Find comfort in scripture tonight.',
      story_context: "There is a particular loneliness that belongs to the night. Everyone else is asleep. The world is quiet. But you are awake, and the silence makes your pain louder. Whether it\u2019s grief, anxiety, physical pain, or a sadness you can\u2019t name \u2014 the nighttime hours can feel like an eternity. You may be scrolling through your phone looking for distraction, but what you really need is comfort. Real, deep, someone-sees-me comfort.\n\nDavid wrote many of his psalms during the darkest seasons of his life. Some were written while hiding from enemies. Others were written during exile. Psalm 63 was written in the wilderness of Judah \u2014 a barren, desolate landscape where David was cut off from everything familiar. In this psalm, David describes lying awake at night. But instead of listing his fears, he does something unexpected. He turns his sleepless hours into a conversation with God. He doesn\u2019t pretend the difficulty isn\u2019t there. He simply chooses where to direct his attention in the middle of it.",
      verse_reference: 'Psalm 63:6',
      verse_text: 'On my bed I remember you; I think of you through the watches of the night.',
      reflection_text: "David didn\u2019t have a magic formula for sleepless nights. He had a practice: remembering God. Not studying theology. Not solving problems. Just turning his mind toward who God is and what God has done. \u201cThrough the watches of the night\u201d tells us this wasn\u2019t a brief moment of prayer before sleep came easily. David was awake for hours. But he chose to fill those hours with God\u2019s presence instead of fear.\n\nIf you are lying awake right now, you don\u2019t have to be productive. You don\u2019t have to fix anything. You can simply talk to God. Tell Him what you\u2019re feeling. Remember a time when He helped you before. Recall a verse that meant something to you. The night may be long, but you are not alone in it. God is not asleep. He is not absent. He is as close to you at 3 AM as He is at noon. And sometimes the sweetest conversations with God happen in the hours when the rest of the world has gone quiet.",
      quiz_question: 'What does David do during sleepless nights according to Psalm 63?',
      option_a: 'He worries about his enemies',
      option_b: 'He makes plans for the next day',
      option_c: 'He remembers God and thinks of Him through the night',
      option_d: 'He reads letters from his friends',
      correct_option: 'C',
      quiz_explanation: 'In Psalm 63:6, David writes \u201cOn my bed I remember you; I think of you through the watches of the night.\u201d Rather than giving in to fear during sleepless hours, David turned his attention to God \u2014 filling the darkness with remembrance and trust.'
    },
    // === HEALING CATEGORY ===
    {
      slug: 'healing-and-comfort',
      title: 'Bible Verses for Healing and Comfort',
      meta_title: 'Bible Verses for Healing and Comfort \u2014 Psalm 147:3 | Scripture for Broken Hearts',
      meta_description: 'When your heart feels shattered, God doesn\u2019t look away. He heals the brokenhearted and binds up their wounds. Find Bible verses for healing and comfort.',
      story_context: "Some pain doesn\u2019t show on the outside. You can have a perfectly normal conversation, go to work, make dinner \u2014 and still feel completely broken inside. Maybe it\u2019s the loss of someone you loved. Maybe it\u2019s betrayal from someone you trusted. Maybe it\u2019s a slow accumulation of disappointments that has left your heart numb. Whatever the source, you know what it feels like when something inside you is wounded. And you may have been told to just \u201cget over it\u201d or \u201cstay positive.\u201d But real wounds don\u2019t heal from willpower alone.\n\nThe God of the Bible is not distant from suffering. Jesus spent much of his ministry among the sick, the grieving, and the outcasts. He didn\u2019t avoid pain \u2014 he walked toward it. The psalms reveal a God who is specifically drawn to broken hearts. Not annoyed by them. Not disappointed. Drawn to them. The psalmist describes a God who doesn\u2019t just notice your wounds from a distance but comes close enough to bandage them himself.",
      verse_reference: 'Psalm 147:3',
      verse_text: 'He heals the brokenhearted and binds up their wounds.',
      reflection_text: "There are two actions in this verse, and both matter. First, God heals. He doesn\u2019t just comfort or distract \u2014 He restores. Second, He binds up wounds. This is intimate, careful language. It\u2019s the image of someone kneeling beside you, gently wrapping a wound with bandages. It\u2019s personal and tender.\n\nHealing rarely happens in an instant. A broken bone mends slowly. A grieving heart moves through stages. And God is patient with every stage. He doesn\u2019t rush you through your pain or set a deadline for your recovery. He stays beside you through the whole process \u2014 through the tears, through the anger, through the numbness, through the slow return of hope. If you feel broken right now, please know that God is not waiting for you to put yourself back together before He shows up. He comes to you in the broken place. That\u2019s where healing starts.",
      quiz_question: 'What does Psalm 147:3 say God does for the brokenhearted?',
      option_a: 'He tells them to be stronger',
      option_b: 'He heals them and binds up their wounds',
      option_c: 'He waits for them to heal themselves',
      option_d: 'He removes all their problems',
      correct_option: 'B',
      quiz_explanation: 'Psalm 147:3 says God \u201cheals the brokenhearted and binds up their wounds.\u201d This verse paints a picture of a God who is personally and tenderly involved in our healing \u2014 not distant, but close enough to bandage our deepest hurts.'
    },
    {
      slug: 'emotional-healing',
      title: 'Bible Verses for Emotional Healing',
      meta_title: 'Bible Verses for Emotional Healing \u2014 The Woman Who Touched Jesus\u2019 Robe | Scripture for Inner Pain',
      meta_description: 'She had suffered for twelve years and spent everything she had. Then she touched Jesus\u2019 robe. Discover what her story means for your emotional healing today.',
      story_context: "Emotional wounds are invisible, which makes them easy for others to overlook \u2014 but impossible for you to ignore. You carry them into every room, every conversation, every quiet moment. Maybe you\u2019ve tried to heal through willpower, through staying busy, through pretending it doesn\u2019t hurt. But the pain keeps resurfacing. Emotional healing is not weakness. It is one of the bravest journeys a person can take.\n\nIn the Gospels, there is a woman who had been bleeding for twelve years. She had visited every doctor, spent all her money, and only gotten worse. In her culture, her condition made her ritually unclean \u2014 she wasn\u2019t supposed to touch anyone, and no one was supposed to touch her. She had been isolated by her suffering for over a decade. But when she heard that Jesus was passing through, she pushed through the crowd and touched the edge of his robe. She didn\u2019t ask permission. She didn\u2019t make an appointment. She simply reached out with whatever faith she had left.",
      verse_reference: 'Mark 5:34',
      verse_text: 'Your faith has healed you. Go in peace.',
      reflection_text: "Jesus felt the touch. He stopped in a crowd of hundreds and asked, \u201cWho touched me?\u201d The woman came forward, trembling, expecting rebuke. Instead, Jesus called her \u201cdaughter\u201d \u2014 a word of tenderness and belonging. He didn\u2019t shame her for breaking the rules. He didn\u2019t lecture her about proper procedure. He saw her suffering, honored her courage, and spoke healing over her life.\n\nIf you are carrying emotional pain right now, this story is for you. You don\u2019t need to have perfect faith. You don\u2019t need to approach God with the right words or the right amount of belief. You just need to reach out \u2014 messy, desperate, trembling. That\u2019s enough. God doesn\u2019t wait for you to clean yourself up before He responds. He meets you in the reaching. And the words He speaks over you are the same ones He spoke to her: go in peace. Your pain has been seen. Your courage has been honored. Healing has already begun.",
      quiz_question: 'What did Jesus say to the woman after she was healed?',
      option_a: 'You should not have touched me',
      option_b: 'Your faith has healed you. Go in peace.',
      option_c: 'You must tell everyone what happened',
      option_d: 'Go and make an offering at the temple',
      correct_option: 'B',
      quiz_explanation: 'In Mark 5:34, Jesus told the woman \u201cYour faith has healed you. Go in peace.\u201d He didn\u2019t rebuke her for her desperate act. He honored her courage, validated her suffering, and released her into peace \u2014 showing that God meets us exactly where we are.'
    },
    {
      slug: 'strength-during-illness',
      title: 'Bible Verses for Strength During Illness',
      meta_title: 'Bible Verses for Strength During Illness \u2014 2 Corinthians 4:8 | Scripture for the Sick',
      meta_description: 'When illness wears down your body and spirit, Paul\u2019s words remind us that we may be pressed but we are not destroyed. Find comfort in scripture.',
      story_context: "Being sick changes everything. It\u2019s not just your body that suffers \u2014 it\u2019s your sense of self. You can\u2019t do the things you used to do. You depend on others in ways that feel uncomfortable. Some days the pain is physical. Other days it\u2019s the emotional weight of not knowing when \u2014 or if \u2014 you\u2019ll feel normal again. Illness can make you feel invisible, like life is moving on without you. If you are in that place right now, your pain is real and it matters.\n\nPaul endured extraordinary physical suffering throughout his ministry. He was beaten, stoned, shipwrecked, and imprisoned repeatedly. He lived with chronic pain and constant danger. But when he wrote to the church in Corinth, he didn\u2019t sugarcoat his experience. He was brutally honest about the hardship. And yet in the middle of that honesty, he made a statement that has given hope to suffering people for two thousand years. He acknowledged the pressure without surrendering to it.",
      verse_reference: '2 Corinthians 4:8',
      verse_text: 'We are hard pressed on every side, but not crushed; perplexed, but not in despair.',
      reflection_text: "Paul doesn\u2019t deny the difficulty. \u201cHard pressed on every side\u201d is not a metaphor for a bad day. It\u2019s a description of being surrounded by suffering with no obvious escape. But then comes the remarkable turn: \u201cbut not crushed.\u201d There is a space between being pressed and being crushed, and that space is where God\u2019s sustaining power lives.\n\nIf you are dealing with illness, you may feel pressed on every side \u2014 by symptoms, by doctors\u2019 appointments, by fear of the unknown, by the sheer exhaustion of being unwell. Paul doesn\u2019t promise that the pressure will disappear. But he testifies that it does not have to destroy you. Something holds you together even when everything is pushing against you. That something is not your own willpower. It is the quiet, persistent faithfulness of a God who sustains you one day, one hour, one breath at a time. You are pressed, but you are still here. And that matters more than you know.",
      quiz_question: 'What does Paul say about hardship in 2 Corinthians 4:8?',
      option_a: 'We never experience difficulty as believers',
      option_b: 'We are hard pressed but not crushed, perplexed but not in despair',
      option_c: 'We should hide our suffering from others',
      option_d: 'We must wait silently until pain passes',
      correct_option: 'B',
      quiz_explanation: 'Paul writes \u201cWe are hard pressed on every side, but not crushed; perplexed, but not in despair.\u201d He acknowledges real suffering honestly while testifying that God\u2019s sustaining power keeps us from being destroyed by it.'
    },
    {
      slug: 'recovery-after-difficulty',
      title: 'Bible Verses for Recovery After Difficult Times',
      meta_title: 'Bible Verses for Recovery After Difficult Times \u2014 Psalm 23:3 | Scripture for Restoration',
      meta_description: 'After the storm passes, healing begins slowly. Psalm 23 reminds us that God restores our souls. Find Bible verses for recovery and renewal.',
      story_context: "The crisis may be over, but you don\u2019t feel okay. People expect you to bounce back, to be grateful, to move on. But inside, you\u2019re still processing what you went through. Recovery is strange that way \u2014 the danger passes but the effects linger. You might feel fragile, forgetful, emotionally flat, or strangely sad even when things are \u201cbetter.\u201d That\u2019s not weakness. That\u2019s what healing looks like from the inside.\n\nDavid\u2019s life was a cycle of crisis and recovery. He survived Saul\u2019s pursuit, Absalom\u2019s rebellion, personal failures, and public shame. He didn\u2019t bounce back quickly or neatly. Many of his psalms were written in the aftermath of hard seasons, when the immediate threat was gone but the weariness remained. Psalm 23, the most beloved psalm in history, is not written from a place of comfort. It\u2019s written by a man who has walked through dark valleys and come out the other side \u2014 changed, perhaps scarred, but held together by a Shepherd who never left.",
      verse_reference: 'Psalm 23:3',
      verse_text: 'He restores my soul.',
      reflection_text: "Four words. \u201cHe restores my soul.\u201d Not \u201cI restored my own soul through discipline and effort.\u201d Not \u201cTime healed all wounds.\u201d He \u2014 God \u2014 restores. The work of recovery is not entirely on your shoulders. God is actively involved in putting you back together.\n\nThe word \u201crestore\u201d implies that something was depleted, damaged, or lost. It acknowledges that you went through something real. But it also carries a promise: what was lost can be returned. Not necessarily to the way things were before, but to a place of wholeness. Recovery takes time. There will be setbacks. Some days you\u2019ll feel like yourself again, and other days you\u2019ll wonder if you\u2019ll ever get there. But the Shepherd is patient. He doesn\u2019t rush restoration. He walks with you through it, day by day, at whatever pace your soul needs. You survived the valley. Now let Him tend to what the valley cost you.",
      quiz_question: 'What does the shepherd do for the soul in Psalm 23:3?',
      option_a: 'He challenges it to grow stronger',
      option_b: 'He restores it',
      option_c: 'He tests it with new difficulties',
      option_d: 'He leaves it to heal on its own',
      correct_option: 'B',
      quiz_explanation: 'Psalm 23:3 simply says \u201cHe restores my soul.\u201d The work of restoration belongs to the Shepherd, not to us. After difficult seasons, God is actively and patiently involved in renewing what was depleted \u2014 at whatever pace we need.'
    }
  ];

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO articles (
      slug, title, meta_title, meta_description, story_context,
      verse_reference, verse_text, reflection_text,
      quiz_question, option_a, option_b, option_c, option_d,
      correct_option, quiz_explanation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of articles) {
    stmt.run([
      a.slug, a.title, a.meta_title, a.meta_description, a.story_context,
      a.verse_reference, a.verse_text, a.reflection_text,
      a.quiz_question, a.option_a, a.option_b, a.option_c, a.option_d,
      a.correct_option, a.quiz_explanation
    ]);
  }
  stmt.free();

  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);

  db.close();
  console.log('Seeded ' + articles.length + ' articles successfully.');
}

seed().catch(err => { console.error(err); process.exit(1); });
