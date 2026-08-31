"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MediaUploader } from "./MediaUploader";

const REGIONS = ["Central", "Eastern", "Northern", "Western"];
const OWNERSHIP_TYPES = ["Government", "Private", "Government-Aided"];
const LEVELS = ["Nursery", "Primary", "Secondary"];
const BOARDING_TYPES = ["Day", "Boarding", "Both"];
const CURRICULUM_TYPES = ["Uganda National Curriculum", "British", "American", "Other"];
const TERMS = ["Term 1", "Term 2", "Term 3", "Annual"];

interface District {
  id: string;
  name: string;
}

interface FeeRow {
  level: string;
  term: string;
  category: string;
  amountUGX: string;
  notes: string;
}

interface FormState {
  name: string;
  region: string;
  district: string;
  subCounty: string;
  address: string;
  ownershipType: string;
  levels: string[];
  boardingType: string;
  curriculum: string;
  foundedYear: string;
  moeRegistrationNumber: string;
  description: string;
  facilities: string[];
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
  feeStructure: FeeRow[];
  images: string[];
  video: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  region: "",
  district: "",
  subCounty: "",
  address: "",
  ownershipType: "",
  levels: [],
  boardingType: "",
  curriculum: "Uganda National Curriculum",
  foundedYear: "",
  moeRegistrationNumber: "",
  description: "",
  facilities: [],
  contactPhone: "",
  contactEmail: "",
  contactWebsite: "",
  feeStructure: [],
  images: [],
  video: "",
};

export interface InitialSchool {
  _id: string;
  name: string;
  region: string;
  district: { _id: string; name: string } | string;
  subCounty?: string;
  address?: string;
  ownershipType: string;
  levels: string[];
  boardingType: string;
  curriculum: string;
  foundedYear?: number;
  moeRegistrationNumber?: string;
  description?: string;
  facilities: string[];
  contact: { phone: string; email?: string; website?: string };
  feeStructure: { level: string; term: string; category: string; amountUGX: number; notes?: string }[];
  images: string[];
  video?: string;
}

function schoolToForm(school: InitialSchool): FormState {
  return {
    name: school.name,
    region: school.region,
    district: typeof school.district === "string" ? school.district : school.district._id,
    subCounty: school.subCounty ?? "",
    address: school.address ?? "",
    ownershipType: school.ownershipType,
    levels: school.levels,
    boardingType: school.boardingType,
    curriculum: school.curriculum,
    foundedYear: school.foundedYear ? String(school.foundedYear) : "",
    moeRegistrationNumber: school.moeRegistrationNumber ?? "",
    description: school.description ?? "",
    facilities: school.facilities,
    contactPhone: school.contact.phone,
    contactEmail: school.contact.email ?? "",
    contactWebsite: school.contact.website ?? "",
    feeStructure: school.feeStructure.map((f) => ({
      level: f.level,
      term: f.term,
      category: f.category,
      amountUGX: String(f.amountUGX),
      notes: f.notes ?? "",
    })),
    images: school.images ?? [],
    video: school.video ?? "",
  };
}

export function RegisterSchoolForm({
  mode,
  schoolId,
  initialSchool,
}: {
  mode: "create" | "edit";
  schoolId?: string;
  initialSchool?: InitialSchool;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(
    initialSchool ? schoolToForm(initialSchool) : EMPTY_FORM
  );
  const [districts, setDistricts] = useState<District[]>([]);
  const [facilityInput, setFacilityInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!form.region) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDistricts([]);
      return;
    }
    fetch(`/api/districts?region=${encodeURIComponent(form.region)}`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts ?? []));
  }, [form.region]);

  function toggleLevel(level: string) {
    setForm((f) => ({
      ...f,
      levels: f.levels.includes(level)
        ? f.levels.filter((l) => l !== level)
        : [...f.levels, level],
    }));
  }

  function addFacility() {
    const value = facilityInput.trim();
    if (value && !form.facilities.includes(value)) {
      setForm((f) => ({ ...f, facilities: [...f.facilities, value] }));
    }
    setFacilityInput("");
  }

  function removeFacility(value: string) {
    setForm((f) => ({ ...f, facilities: f.facilities.filter((x) => x !== value) }));
  }

  function addFeeRow() {
    setForm((f) => ({
      ...f,
      feeStructure: [
        ...f.feeStructure,
        { level: "", term: "Term 1", category: "Tuition", amountUGX: "", notes: "" },
      ],
    }));
  }

  function updateFeeRow(index: number, patch: Partial<FeeRow>) {
    setForm((f) => ({
      ...f,
      feeStructure: f.feeStructure.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }));
  }

  function removeFeeRow(index: number) {
    setForm((f) => ({ ...f, feeStructure: f.feeStructure.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.levels.length === 0) {
      setError("Select at least one level (Nursery/Primary/Secondary).");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: form.name,
      region: form.region,
      district: form.district,
      subCounty: form.subCounty || undefined,
      address: form.address || undefined,
      ownershipType: form.ownershipType,
      levels: form.levels,
      boardingType: form.boardingType,
      curriculum: form.curriculum,
      foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
      moeRegistrationNumber: form.moeRegistrationNumber || undefined,
      description: form.description || undefined,
      facilities: form.facilities,
      images: form.images,
      video: form.video || undefined,
      contact: {
        phone: form.contactPhone,
        email: form.contactEmail || undefined,
        website: form.contactWebsite || undefined,
      },
      feeStructure: form.feeStructure
        .filter((row) => row.level && row.category && row.amountUGX)
        .map((row) => ({
          level: row.level,
          term: row.term,
          category: row.category,
          amountUGX: Number(row.amountUGX),
          notes: row.notes || undefined,
        })),
    };

    const url = mode === "edit" ? `/api/schools/mine/${schoolId}` : "/api/schools/mine";
    const res = await fetch(url, {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/register-school");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-paper-white border border-ink-soft/30 rounded-sm p-8 space-y-6">
      <h1 className="font-display text-2xl font-semibold text-chalkboard">
        {mode === "edit" ? "Edit school" : "Register a school"}
      </h1>

      {mode === "edit" && (
        <p className="text-sm text-ink-soft -mt-4">
          Saving changes will send this listing back for a quick re-review
          before it&apos;s live again.
        </p>
      )}

      <div>
        <label className="block text-sm text-ink-soft mb-1">School name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1">Region</label>
          <select
            required
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value, district: "" })}
            className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
          >
            <option value="">Select region</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1">District</label>
          <select
            required
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            disabled={!form.region}
            className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard disabled:opacity-50"
          >
            <option value="">Select district</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1">Sub-county / Town (optional)</label>
          <input
            value={form.subCounty}
            onChange={(e) => setForm({ ...form, subCounty: e.target.value })}
            className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1">Address (optional)</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-1">Ownership type</label>
        <select
          required
          value={form.ownershipType}
          onChange={(e) => setForm({ ...form, ownershipType: e.target.value })}
          className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        >
          <option value="">Select ownership type</option>
          {OWNERSHIP_TYPES.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-2">Levels offered</label>
        <div className="flex gap-2">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => toggleLevel(level)}
              className={`text-sm font-ledger rounded-sm px-4 py-2 border transition-colors ${
                form.levels.includes(level)
                  ? "bg-chalkboard text-paper-white border-chalkboard"
                  : "bg-transparent text-ink-soft border-ink-soft/40"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1">Boarding type</label>
          <select
            required
            value={form.boardingType}
            onChange={(e) => setForm({ ...form, boardingType: e.target.value })}
            className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
          >
            <option value="">Select</option>
            {BOARDING_TYPES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1">Curriculum</label>
          <select
            value={form.curriculum}
            onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
            className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
          >
            {CURRICULUM_TYPES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-1">Founded year (optional)</label>
        <input
          type="number"
          value={form.foundedYear}
          onChange={(e) => setForm({ ...form, foundedYear: e.target.value })}
          className="w-32 bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        />
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-1">
          Ministry of Education Registration Number (optional)
        </label>
        <input
          value={form.moeRegistrationNumber}
          onChange={(e) => setForm({ ...form, moeRegistrationNumber: e.target.value })}
          placeholder="e.g. MOE/2024/UG/00123"
          className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        />
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-1">Description (optional)</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
        />
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-2">Facilities</label>
        <div className="flex gap-2 mb-2">
          <input
            value={facilityInput}
            onChange={(e) => setFacilityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFacility();
              }
            }}
            placeholder="e.g. Library"
            className="flex-1 bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
          />
          <button
            type="button"
            onClick={addFacility}
            className="bg-paper-dark text-ink font-ledger text-sm rounded-sm px-4 py-2 hover:brightness-95"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.facilities.map((facility) => (
            <span
              key={facility}
              className="flex items-center gap-2 text-sm bg-paper-dark rounded-sm px-3 py-1"
            >
              {facility}
              <button
                type="button"
                onClick={() => removeFacility(facility)}
                className="text-margin-red font-semibold"
                aria-label={`Remove ${facility}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-ink-soft/40 pt-6">
        <h2 className="font-display text-lg font-semibold text-chalkboard mb-3">Photos & video</h2>
        <MediaUploader
          images={form.images}
          onImagesChange={(images) => setForm({ ...form, images })}
          video={form.video}
          onVideoChange={(video) => setForm({ ...form, video })}
        />
      </div>

      <div className="border-t border-dashed border-ink-soft/40 pt-6">
        <h2 className="font-display text-lg font-semibold text-chalkboard mb-3">Contact</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-ink-soft mb-1">Phone</label>
            <input
              required
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              placeholder="+256 7XX XXX XXX"
              className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-soft mb-1">Email (optional)</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-soft mb-1">Website (optional)</label>
            <input
              value={form.contactWebsite}
              onChange={(e) => setForm({ ...form, contactWebsite: e.target.value })}
              className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-ink-soft/40 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-chalkboard">Fee structure</h2>
          <button
            type="button"
            onClick={addFeeRow}
            className="bg-paper-dark text-ink font-ledger text-xs rounded-sm px-3 py-1.5 hover:brightness-95"
          >
            + Add fee item
          </button>
        </div>

        {form.feeStructure.length === 0 && (
          <p className="text-sm text-ink-soft/70">
            No fee items yet — add at least one so parents know what to expect.
          </p>
        )}

        <div className="space-y-3">
          {form.feeStructure.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input
                placeholder="Level (e.g. Senior 1)"
                value={row.level}
                onChange={(e) => updateFeeRow(i, { level: e.target.value })}
                className="col-span-3 bg-white border border-ink-soft/40 rounded-sm px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-chalkboard"
              />
              <select
                value={row.term}
                onChange={(e) => updateFeeRow(i, { term: e.target.value })}
                className="col-span-2 bg-white border border-ink-soft/40 rounded-sm px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-chalkboard"
              >
                {TERMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                placeholder="Category (Tuition...)"
                value={row.category}
                onChange={(e) => updateFeeRow(i, { category: e.target.value })}
                className="col-span-3 bg-white border border-ink-soft/40 rounded-sm px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-chalkboard"
              />
              <input
                type="number"
                placeholder="Amount (UGX)"
                value={row.amountUGX}
                onChange={(e) => updateFeeRow(i, { amountUGX: e.target.value })}
                className="col-span-3 bg-white border border-ink-soft/40 rounded-sm px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-chalkboard font-ledger"
              />
              <button
                type="button"
                onClick={() => removeFeeRow(i)}
                className="col-span-1 text-margin-red font-semibold text-lg"
                aria-label="Remove fee item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-margin-red">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-chalkboard text-paper-white font-ledger text-sm rounded-sm px-6 py-3 hover:bg-chalkboard-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Submitting..." : mode === "edit" ? "Save & resubmit for review" : "Submit for review"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/register-school")}
          className="text-ink-soft font-ledger text-sm px-4 py-3 hover:text-chalkboard"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
