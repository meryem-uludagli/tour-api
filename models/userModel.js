const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Bu tur ismi zaten mevcut"],
      required: [true, "Tur isim değerine sahip olmalı"],
      // validate: [
      //   validator.isAlphanumeric, // third party validator
      //   "Tur ismi özel karakter içermemeli",
      // ],
    },

    price: {
      type: Number,
      required: [true, "Tur fiyat değerine sahip olmalı"],
    },

    priceDiscount: {
      type: Number,
      // custom validator (kendi yazdığımız kontrol methdoları)
      // doğrulama fonksiyonları false return ederse doğrulamadna geçmedi anlmaına gelir ve belge veritabanına kaydedilmez true return ederse doğrulamadan geçti anlamına gelir
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "İndirim fiyatı asıl fiyattan büyük olamaz",
      },
    },

    duration: {
      type: Number,
      required: [true, "Tur süre değerine sahip olmalı"],
    },

    difficulty: {
      type: String,
      required: [true, "Tur zorluk değerine sahip olmalı"],
      enum: ["easy", "medium", "hard", "difficult"],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "Tur maksimum kişi sayısı değerine sahip olmalı"],
    },

    ratingsAverage: {
      type: Number,
      min: [1, "Rating değeri 1'den küçük olamaz"],
      max: [5, "Rating değeri 5'den büyük olamaz"],
      default: 4.0,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      maxLength: [200, "Özet alanı 200 karakteri geçemez"],
      required: [true, "Tur özet değerine sahip olmalı"],
    },

    description: {
      type: String,
      maxLength: [1000, "Açıklama alanı 1000 karakteri geçemez"],
      required: [true, "Tur açıklama değerine sahip olmalı"],
    },

    imageCover: {
      type: String,
      required: [true, "Tur kağak fotğrafına sahip olmalı"],
    },

    images: {
      type: [String],
    },

    startDates: {
      type: [Date],
    },

    durationHour: { type: Number },

    // embedding
    startLocation: {
      description: String,
      type: { type: String, default: "Point", enum: "Point" },
      coordinates: [Number],
      address: String,
    },

    // embedding
    locations: [
      {
        description: String,
        type: { type: String, default: "Point", enum: "Point" },
        coordinates: [Number],
        day: Number,
      },
    ],

    // refferance
    guides: [
      {
        type: mongoose.Schema.ObjectId, // referans tanımında tip her zaman Object Id'di
        ref: "User", // id'lerin hangi kolleksiyona ait olduğunu söyledik
      },
    ],
  },
  // şema ayarları
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
