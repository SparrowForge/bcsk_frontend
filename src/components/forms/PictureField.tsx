const input = "w-full rounded-lg border border-line px-3.5 py-2.5 text-sm focus:border-green-mid focus:outline-none";

/**
 * The picture slot on the admin News & Events and Student Corner forms: the current picture
 * if there is one, a file picker, and a "remove" box. Posts as `image` and `removeImage`;
 * the action treats an empty picker as "keep what is there", so saving a text edit never
 * drops the picture.
 */
export function PictureField({ current, optional }: { current: string | null; optional?: boolean }) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {current && (
        <div className="flex flex-col items-start gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current} alt="" className="h-20 w-32 rounded-lg object-cover ring-1 ring-line" />
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-red-600">
            <input type="checkbox" name="removeImage" /> Remove picture
          </label>
        </div>
      )}
      <label className="block min-w-60 flex-1 text-xs font-bold text-ink">
        {current ? "Replace picture" : "Picture"}{" "}
        <span className="font-normal text-ink-soft">
          ({optional ? "optional — " : ""}JPG, PNG or WEBP; a landscape photo works best)
        </span>
        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp"
          className={`mt-1.5 ${input} file:mr-3 file:rounded file:border-0 file:bg-green-soft file:px-3 file:py-1 file:text-xs file:font-bold file:text-green`}
        />
      </label>
    </div>
  );
}
