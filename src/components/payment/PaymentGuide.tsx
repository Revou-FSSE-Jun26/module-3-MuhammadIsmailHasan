export function PaymentGuide() {
  return (
    <section className="mt-10 rounded-2xl border border-line bg-[#f6f6f6] p-5 text-sm">
      <h2 className="text-lg font-bold">How to pay (demo)</h2>
      <p className="mt-1 text-muted">
        This store uses the Midtrans sandbox, so no real money is charged. After you place your
        order, the Midtrans payment window opens. Pay with a test credit card:
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5">
        <li>
          Choose <b>Credit/Debit Card</b>.
        </li>
        <li>
          Card number:{" "}
          <code className="select-all rounded bg-white px-1.5 py-0.5 font-semibold">
            4811 1111 1111 1114
          </code>
        </li>
        <li>
          Expiry: any future date, for example{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-semibold">12/30</code>. CVV:{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-semibold">123</code>
        </li>
        <li>
          Press <b>Pay now</b>, then enter the OTP{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-semibold">112233</code> when asked.
        </li>
        <li>Wait a few seconds. Your order changes to Paid automatically.</li>
      </ol>
      <p className="mt-4 text-xs text-muted">
        Closed the window? You can pay later with the Pay now button in My orders. Items from
        several sellers become separate orders, and each one is paid on its own.
      </p>
    </section>
  );
}
