import { LegalShell, S } from "@/components/LegalShell";

export const metadata = { title: "Date Credits & Wallet Terms — Tabled" };

export default function Credits() {
  return (
    <LegalShell title="Date Credits & Wallet Terms">
      <S title="1. What Date Credits are">
        <p>
          Date Credits are prepaid value in your Tabled wallet, denominated in U.S. dollars and{" "}
          <b>redeemable only for dining and experiences at Tabled partner venues</b>, booked
          through the Service. Credits come from three sources: (a) membership conversion — 75%
          of each membership fee converts to credits (100% during a founding member&apos;s first
          90 days); (b) top-ups — 100% of every top-up converts to credits; and (c) promotional
          credits we grant (referral rewards, goodwill credits, founding perks). Credits are a
          limited-purpose stored balance — they are not a bank account, not legal tender, and
          earn no interest.
        </p>
      </S>

      <S title="2. Credits never expire">
        <p>
          Date Credits purchased or converted from fees <b>do not expire</b> and carry{" "}
          <b>no dormancy, inactivity, or service fees</b>. Promotional credits we grant for free
          may carry a stated expiration disclosed when granted. If you cancel membership, your
          credit balance remains redeemable at partner venues.
        </p>
      </S>

      <S title="3. The one absolute rule">
        <p>
          <b>Money on Tabled never moves between members.</b> Credits cannot be sent, gifted,
          sold, or transferred to any person. Value flows only from you to the Club and from the
          Club to venues. Hosting an invitation means your credits settle the bill at a
          restaurant — the other member never receives funds of any kind. Any attempt to use
          Tabled to transfer value between people is grounds for immediate termination.
        </p>
      </S>

      <S title="4. Redemption, cash back & refunds">
        <p>
          Credits apply to the bill at partner venues via your booking. If an evening costs more
          than your balance, you pay the difference at confirmation or at the venue. Credits
          generally have no cash value; however, where state law grants redemption rights —
          for example, California residents may redeem a remaining balance under $10 in cash —
          we honor them, and unspent purchased balances are refundable where required by
          applicable gift-card, dating-service, or consumer-protection law. Unclaimed balances
          are handled in accordance with state unclaimed-property law.
        </p>
      </S>

      <S title="5. Commitment stakes & no-shows">
        <p>
          Confirmed dates carry a small commitment stake set by Tabled and disclosed at booking.
          Arrive, and your stake goes toward the evening. If you fail to appear without
          canceling within the stated window, you are charged a fixed no-show fee payable to
          Tabled, and Tabled separately issues a goodwill credit to the member who kept the
          reservation. The fee and the credit are independent obligations involving only Tabled —{" "}
          <b>no payment ever passes between members.</b>
        </p>
      </S>

      <S title="6. Coupled wallets">
        <p>
          When two members activate Coupled status, membership fees end and their wallets merge
          into a shared couple wallet, locked to the pair. Top-ups to a couple wallet earn a
          bonus credit rate (currently 15%, rising with tenure to 18% and 20%) disclosed at
          top-up. If Coupled status ends, the remaining balance is divided in proportion to each
          member&apos;s contributions, and individual wallets resume. Couple-wallet credits follow
          all rules above, including venue-only redemption and no member-to-member transfer.
        </p>
      </S>

      <S title="7. Founding first-date gift cards">
        <p>
          For the first 500 founding members in each city: when your first mutual match books a
          confirmed table, Tabled purchases a gift card (up to $100) from that venue for that
          evening. The gift card is the venue&apos;s own instrument, applies to that booking, and
          any unused portion follows the venue&apos;s gift-card terms. One per member; issued at
          booking, not at signup.
        </p>
      </S>

      <S title="8. Changes">
        <p>
          We may update these Wallet Terms with notice. Changes never reduce a credit balance
          you already hold, never add expiration or fees to already-issued purchased or
          converted credits, and apply prospectively.
        </p>
      </S>
    </LegalShell>
  );
}
