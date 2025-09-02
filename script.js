// Elements
const el = (id) => document.getElementById(id);
const intro = el('intro');
const quiz = el('quiz');
const result = el('result');
const reviewBox = el('review');

const btnStart = el('btn-start');
const btnNext = el('btn-next');
const btnPrev = el('btn-prev');
const btnRetry = el('btn-retry');
const btnReview = el('btn-review');
const btnExport = el('btn-export');

const qText = el('question-text');
const optionsBox = el('options');
const qIdx = el('q-idx');
const progressBar = el('progress-bar');
const scoreBig = el('score-big');
const scoreMsg = el('score-msg');
const timeSpent = el('time-spent');

// State
let QUESTIONS = [];
let current = 0;
let selections = [];
let startedAt = 0;

// Parse bundled questions
function parseQuestionsFromText(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  let blocks = [], block = [];
  const flush=()=>{ if(block.length){ blocks.push(block.join('\n')); block=[]; } };
  for(const line of lines){
    if(line.trim()===''){ flush(); } else block.push(line);
  }
  flush();
  return blocks.map(b=>{
    const q = b.match(/^\s*\d+\.\s*(.+?)\n/)[1];
    const a = b.match(/\na\.\s*(.+)/i)[1];
    const bb= b.match(/\nb\.\s*(.+)/i)[1];
    const c = b.match(/\nc\.\s*(.+)/i)[1];
    const d = b.match(/\nd\.\s*(.+)/i)[1];
    const ans=b.match(/Answer:\s*([a-d])/i)[1].toLowerCase();
    return { q:q.trim(), choices:[a,bb,c,d], answer:{a:0,b:1,c:2,d:3}[ans] };
  });
}

// Built-in 30 Qs
const SAMPLE_TEXT = `
1. What is the main mission of IncoNetwork in web3
a. To build a centralized privacy system
b. To enable encrypted transactions on-chain through FHE
c. To create a private banking app
d. To replace bitcoin
Answer: b

2. Which technology powers IncoNetwork’s ability to compute on encrypted data
a. Zero knowledge proofs
b. Multi party computation
c. Fully homomorphic encryption
d. Sidechains
Answer: c

3. Why is privacy important in web3
a. To hide transaction history from all users
b. To protect sensitive financial data while keeping systems decentralized
c. To create a shadow banking ecosystem
d. To make blockchains illegal to track
Answer: b

4. What does encrypted balances on IncoNetwork mean
a. Balances are hidden off-chain
b. Balances are visible but not modifiable
c. Balances are stored encrypted so amounts are private yet usable
d. Balances cannot be accessed at all
Answer: c

5. What problem do programmable decryption rules solve
a. Allowing only specific parties to view decrypted information when needed
b. Making all data public by default
c. Preventing tokens from being transferred
d. Encrypting private keys
Answer: a

6. What is a key benefit of encrypted allowances
a. Anyone can spend your tokens freely
b. Allowances can be set privately without exposing transaction amounts
c. They reduce gas fees
d. They make wallets less secure
Answer: b

7. Confidential DeFi refers to
a. Traditional finance apps with extra passwords
b. DeFi protocols with transaction data hidden but still verifiable
c. Banking systems with no privacy features
d. DeFi protocols that don’t use smart contracts
Answer: b

8. Which of these is NOT a feature of IncoNetwork
a. Encrypted balances
b. Confidential DeFi
c. Decentralized privacy infrastructure
d. Centralized identity tracking
Answer: d

9. How does composability benefit IncoNetwork
a. Protocols can integrate privacy features without breaking interoperability
b. Applications run faster without encryption
c. It removes smart contract support
d. It only works on private blockchains
Answer: a

10. Onchain privacy means
a. Privacy tools exist but only off-chain
b. Privacy is enforced directly at the blockchain protocol level
c. Privacy requires centralized custodians
d. Privacy is optional and external
Answer: b

11. Why is a privacy layer important for web3
a. To hide all code
b. To add flexibility for developers building secure dapps
c. To prevent anyone from using the blockchain
d. To make networks slower
Answer: b

12. IncoNetwork’s approach to private finance is different because
a. It centralizes trust
b. It encrypts transaction data while remaining composable with DeFi
c. It removes tokenization
d. It bans stablecoins
Answer: b

13. Which of the following best describes confidential DeFi
a. Transparent balances for all users
b. Encrypted transactions with verifiable smart contracts
c. Transactions run off-chain entirely
d. A centralized DeFi protocol
Answer: b

14. FHE allows IncoNetwork to
a. Perform computations directly on encrypted data without decrypting
b. Decrypt all blockchain data for faster transactions
c. Run only on private networks
d. Replace zk proofs entirely
Answer: a

15. A decentralized economy benefits from onchain privacy because
a. It reduces market manipulation by hiding sensitive strategies
b. It makes every transaction visible instantly
c. It centralizes liquidity
d. It removes the need for validators
Answer: a

16. Encrypted allowances help protect users by
a. Letting them approve spend without exposing the amount or details
b. Hiding the existence of tokens
c. Stopping gas fee payments
d. Locking wallets permanently
Answer: a

17. Which is the core privacy innovation behind IncoNetwork
a. Sidechains
b. Layer 2 rollups
c. Fully homomorphic encryption
d. Multi sig wallets
Answer: c

18. What does composability enable for developers in IncoNetwork
a. Building privacy features into existing DeFi apps without redesign
b. Only writing new standalone apps
c. Removing smart contracts from their stack
d. Avoiding security audits
Answer: a

19. IncoNetwork adds value to DeFi because
a. It ensures balances and transactions remain confidential
b. It eliminates consensus mechanisms
c. It bans token swaps
d. It requires off-chain execution
Answer: a

20. Which is an example of private finance enabled by IncoNetwork
a. A lending protocol where loan amounts are encrypted
b. A bank statement visible to all users
c. Public on-chain payroll data
d. A centralized DeFi exchange
Answer: a

21. Which challenge does IncoNetwork solve in web3 privacy
a. Breaking interoperability between dapps
b. Adding privacy without sacrificing decentralization
c. Removing token standards
d. Forcing off-chain data storage
Answer: b

22. Programmable decryption rules are important because
a. They define exactly who can see what data under what conditions
b. They remove privacy from smart contracts
c. They make blockchains slower
d. They ban composability
Answer: a

23. Encrypted balances improve user trust by
a. Allowing private holdings without losing utility
b. Hiding tokens permanently
c. Centralizing visibility
d. Replacing wallets
Answer: a

24. Which keyword best describes IncoNetwork’s privacy solution
a. Transparent
b. Confidential
c. Centralized
d. Non programmable
Answer: b

25. What is the missing privacy layer in web3 that IncoNetwork provides
a. Transparent token transfers
b. FHE powered onchain privacy
c. Social logins
d. High gas fees
Answer: b

26. Why does composability matter for confidential DeFi
a. It ensures apps can integrate privacy while staying interoperable
b. It forces isolation of private dapps
c. It eliminates smart contracts
d. It reduces adoption
Answer: a

27. How do encrypted allowances change DeFi user experience
a. By enabling approvals that hide both amount and recipient details
b. By removing the ability to approve transactions
c. By centralizing spending permissions
d. By forcing all approvals on custodians
Answer: a

28. Which of the following is true about IncoNetwork’s private finance vision
a. It allows secure confidential transactions without breaking DeFi composability
b. It bans composable apps
c. It hides all data off-chain
d. It centralizes privacy under one authority
Answer: a

29. IncoNetwork’s confidential DeFi ecosystem ensures
a. Transactions are private yet auditable through cryptography
b. Transactions are always visible to everyone
c. Only custodians can process transactions
d. No financial privacy at all
Answer: a

30. Why is FHE considered a breakthrough for blockchain privacy
a. It makes data usable while still encrypted
b. It removes all encryption layers
c. It slows down composability
d. It centralizes cryptography
Answer: a
`;

QUESTIONS = parseQuestionsFromText(SAMPLE_TEXT);

// Helpers
function show(section){ [intro,quiz,result].forEach(s=>s.classList.remove('visible')); section.classList.add('visible'); }
function setProgress(){
  qIdx.textContent=`Q ${current+1}/${QUESTIONS.length}`;
  progressBar.style.width=`${current/(QUESTIONS.length-1)*100}%`;
}
function renderQuestion(){
  const item=QUESTIONS[current];
  qText.textContent=item.q;
  optionsBox.innerHTML='';
  item.choices.forEach((c,i)=>{
    const btn=document.createElement('button');
    btn.className='option';
    btn.innerHTML=`<strong>${['a','b','c','d'][i]}.</strong> ${c}`;
    if(selections[current]===i) btn.classList.add('selected');
    btn.onclick=()=>{ selections[current]=i; renderQuestion(); };
    optionsBox.appendChild(btn);
  });
  btnPrev.disabled=(current===0);
  btnNext.textContent=(current===QUESTIONS.length-1)?'Finish':'Next →';
  setProgress();
}
function computeScore(){ return selections.reduce((a,s,i)=>a+(s===QUESTIONS[i].answer?1:0),0); }
function finishQuiz(){
  const score=computeScore();
  scoreBig.textContent=`${score}/${QUESTIONS.length}`;
  scoreMsg.textContent= score===QUESTIONS.length?'Perfect! 🔒': score>=24?'Excellent!': score>=18?'Nice job':'Keep learning!';
  const secs=Math.round((Date.now()-startedAt)/1000);
  timeSpent.textContent=`Time: ${Math.floor(secs/60)}m ${secs%60}s`;
  reviewBox.innerHTML='';
  QUESTIONS.forEach((q,i)=>{
    const your=selections[i];
    const correct=your===q.answer;
    const div=document.createElement('div');
    div.className='review-item';
    div.innerHTML=`<h3>${i+1}. ${q.q}<span class="badge ${correct?'good':'bad'}">${correct?'Correct':'Incorrect'}</span></h3>
    <div><strong>Your:</strong> ${your!=null?['a','b','c','d'][your]+'. '+q.choices[your]:'—'}</div>
    <div><strong>Correct:</strong> ${['a','b','c','d'][q.answer]}. ${q.choices[q.answer]}</div>`;
    reviewBox.appendChild(div);
  });
  show(result);
}

// Export results
function exportResults(){
  const lines=QUESTIONS.map((q,i)=>{
    const your=selections[i];
    return `${i+1}. ${q.q}\nCorrect: ${['a','b','c','d'][q.answer]} | Your: ${your!=null?['a','b','c','d'][your]:'—'}`;
  });
  const blob=new Blob([lines.join('\n')],{type:'text/plain'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='inco-quiz-results.txt'; a.click(); URL.revokeObjectURL(url);
}

// Events
btnStart.onclick=()=>{ selections=new Array(QUESTIONS.length).fill(null); current=0; startedAt=Date.now(); renderQuestion(); show(quiz); };
btnNext.onclick=()=> current===QUESTIONS.length-1?finishQuiz():(current++,renderQuestion());
btnPrev.onclick=()=>{ if(current>0){ current--; renderQuestion(); } };
btnRetry.onclick=()=>{ selections=new Array(QUESTIONS.length).fill(null); current=0; startedAt=Date.now(); renderQuestion(); show(quiz); };
btnReview.onclick=()=> reviewBox.classList.toggle('visible');
btnExport.onclick=exportResults;
